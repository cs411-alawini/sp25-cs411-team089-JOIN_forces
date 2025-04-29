from flask import Blueprint, request, jsonify
from models import db
from datetime import datetime
from sqlalchemy import text
import traceback

api = Blueprint('api', __name__)

### ----------- TRIP ROUTES -----------

@api.route('/trips', methods=['GET'])
def get_trips():
    trips = db.session.execute(text("""
        SELECT TripID, TripName, StartDate, EndDate, Description
        FROM Trip
    """)).fetchall()

    return jsonify([{
        'TripID': t.TripID,
        'TripName': t.TripName,
        'StartDate': t.StartDate.isoformat(),
        'EndDate': t.EndDate.isoformat(),
        'Description': t.Description
    } for t in trips])


@api.route('/trips/<int:trip_id>', methods=['GET', 'DELETE', 'PUT', 'OPTIONS'])
def handle_trip_by_id(trip_id):
    if request.method == 'OPTIONS':
        return jsonify({'status': 'ok'}), 200

    if request.method == 'GET':
        trip = db.session.execute(text("""
            SELECT TripID, TripName, StartDate, EndDate, Description
            FROM Trip
            WHERE TripID = :trip_id
        """), {'trip_id': trip_id}).fetchone()

        if not trip:
            return jsonify({'error': 'Trip not found'}), 404

        return jsonify({
            'TripID': trip.TripID,
            'TripName': trip.TripName,
            'StartDate': trip.StartDate.isoformat(),
            'EndDate': trip.EndDate.isoformat(),
            'Description': trip.Description
        })

    elif request.method == 'PUT':
        data = request.json
        try:
            db.session.execute(text("""
                UPDATE Trip
                SET TripName = :TripName,
                    StartDate = :StartDate,
                    EndDate = :EndDate,
                    Description = :Description
                WHERE TripID = :trip_id
            """), {
                'TripName': data['TripName'],
                'StartDate': datetime.strptime(data['StartDate'], '%Y-%m-%d').date(),
                'EndDate': datetime.strptime(data['EndDate'], '%Y-%m-%d').date(),
                'Description': data.get('Description'),
                'trip_id': trip_id
            })
            db.session.commit()
            return jsonify({'message': 'Trip updated'}), 200
        except Exception as e:
            db.session.rollback()
            return jsonify({'error': str(e)}), 400

    elif request.method == 'DELETE':
        try:
            db.session.execute(text("""
                DELETE FROM Trip
                WHERE TripID = :trip_id
            """), {'trip_id': trip_id})
            db.session.commit()
            return jsonify({'message': 'Trip deleted'}), 200
        except Exception as e:
            db.session.rollback()
            return jsonify({'error': str(e)}), 400

@api.route('/trips', methods=['POST'])
def create_trip():
    data = request.json
    try:
        # Insert without RETURNING clause
        db.session.execute(text("""
            INSERT INTO Trip (TripName, StartDate, EndDate, Description)
            VALUES (:TripName, :StartDate, :EndDate, :Description)
        """), {
            'TripName': data['TripName'],
            'StartDate': datetime.strptime(data['StartDate'], '%Y-%m-%d').date(),
            'EndDate': datetime.strptime(data['EndDate'], '%Y-%m-%d').date(),
            'Description': data.get('Description')
        })
        
        # Get the last inserted ID
        result = db.session.execute(text("SELECT LAST_INSERT_ID() as trip_id"))
        trip_id = result.fetchone()[0]
        
        db.session.commit()
        return jsonify({'message': 'Trip created', 'TripID': trip_id}), 201
    except Exception as e:
        db.session.rollback()
        print(f"Error creating trip: {str(e)}")
        return jsonify({'error': str(e)}), 400

@api.route('/top-trips', methods=['GET'])
def get_top_trips():
    try:
        connection = db.engine.raw_connection()
        cursor = connection.cursor()
        cursor.callproc('GetTopTrips')
        results = []
        for row in cursor.fetchall():
            results.append(dict(zip([column[0] for column in cursor.description], row)))

        cursor.close()
        connection.close()
        return jsonify(results)

    except Exception as e:
        return jsonify({'error': str(e)}), 500


@api.route('/frequent-travelers', methods=['GET'])
def get_frequent_travelers():
    try:
        connection = db.engine.raw_connection()
        cursor = connection.cursor()
        cursor.callproc('GetFrequentTravelers')
        results = []
        for row in cursor.fetchall():
            results.append(dict(zip([column[0] for column in cursor.description], row)))

        cursor.close()
        connection.close()
        return jsonify(results)

    except Exception as e:
        return jsonify({'error': str(e)}), 500


### --------- Transaction Routes ---------

@api.route('/create_booking_and_expense/<int:trip_id>', methods=['POST'])
def create_booking_and_expense(trip_id):
    try:
        with db.session.begin():
            db.session.execute(text("""
                INSERT INTO Booking (TripID, BookingType, BookingDate, Cost, Currency)
                VALUES (:trip_id, 'Flight', CURRENT_DATE, 500.00, 'USD')
            """), {'trip_id': trip_id})

            db.session.execute(text("""
                INSERT INTO Expense (TripID, Date, Amount, Currency, CategoryName, Description)
                SELECT :trip_id, CURRENT_DATE, 5.00, 'USD', 'Setup', 'Initial Trip Setup Fee'
                WHERE NOT EXISTS (
                    SELECT 1 FROM Expense
                    WHERE TripID = :trip_id AND CategoryName = 'Setup'
                )
            """), {'trip_id': trip_id})

            result = db.session.execute(text("""
                SELECT SUM(TotalAmount) AS GrandTotal
                FROM (
                    SELECT Amount AS TotalAmount
                    FROM Expense
                    WHERE TripID = :trip_id
                    UNION ALL
                    SELECT Cost AS TotalAmount
                    FROM Booking
                    WHERE TripID = :trip_id
                ) AS Combined
            """), {'trip_id': trip_id})

            total_expenses = result.fetchone()[0] or 0.0

        return jsonify({
            'message': 'Booking and setup expense initialized',
            'TripID': trip_id,
            'TotalExpenses': total_expenses
        }), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 400

@api.route('/promote_active_trip_users', methods=['GET', 'POST'])
def promote_and_get_active_trip_users():
    if request.method == 'POST':
        try:
            with db.session.begin():
                # Promote users first
                db.session.execute(text("""
                    UPDATE TripUser tu
                    JOIN (
                        SELECT e.TripID, tu2.UserID
                        FROM Expense e
                        JOIN TripUser tu2 ON e.TripID = tu2.TripID
                        GROUP BY e.TripID, tu2.UserID
                        HAVING COUNT(e.ExpenseID) >= 5
                    ) AS active_users
                    ON tu.TripID = active_users.TripID AND tu.UserID = active_users.UserID
                    SET tu.PermissionLevel = 'Admin'
                """))

                # Get usernames and emails of active users
                result = db.session.execute(text("""
                    SELECT u.Username, u.Email
                    FROM TripUser tu
                    JOIN (
                        SELECT e.TripID, tu2.UserID
                        FROM Expense e
                        JOIN TripUser tu2 ON e.TripID = tu2.TripID
                        GROUP BY e.TripID, tu2.UserID
                        HAVING COUNT(e.ExpenseID) >= 5
                    ) AS active_users
                    ON tu.TripID = active_users.TripID AND tu.UserID = active_users.UserID
                    JOIN User u ON tu.UserID = u.UserID
                """))

                active_users = [{'Username': row[0], 'Email': row[1]} for row in result.fetchall()]

            return jsonify({'message': 'Active users promoted to Admin', 'active_users': active_users}), 200

        except Exception as e:
            db.session.rollback()
            print('Error in promote_and_get_active_trip_users:', e)
            return jsonify({'error': str(e)}), 400

    elif request.method == 'GET':
        # Just return the active users without promoting them
        try:
            result = db.session.execute(text("""
                SELECT u.Username, u.Email
                FROM TripUser tu
                JOIN (
                    SELECT e.TripID, tu2.UserID
                    FROM Expense e
                    JOIN TripUser tu2 ON e.TripID = tu2.TripID
                    GROUP BY e.TripID, tu2.UserID
                    HAVING COUNT(e.ExpenseID) >= 5
                ) AS active_users
                ON tu.TripID = active_users.TripID AND tu.UserID = active_users.UserID
                JOIN User u ON tu.UserID = u.UserID
            """))

            active_users = [{'Username': row[0], 'Email': row[1]} for row in result.fetchall()]

            return jsonify({'active_users': active_users}), 200

        except Exception as e:
            print('Error in fetching active users:', e)
            return jsonify({'error': str(e)}), 400

@api.route('/trip_expenses/<int:trip_id>', methods=['GET'])
def get_trip_expenses(trip_id):
    expenses = db.session.execute(text("""
        SELECT ExpenseID, Date, Amount, Currency, CategoryName, Description
        FROM Expense
        WHERE TripID = :trip_id
    """), {'trip_id': trip_id}).fetchall()

    return jsonify([{
        'ExpenseID': e.ExpenseID,
        'Date': e.Date.isoformat(),
        'Amount': str(e.Amount),
        'Currency': e.Currency,
        'CategoryName': e.CategoryName,
        'Description': e.Description
    } for e in expenses])


@api.route('/archived-trips', methods=['GET'])
def get_archived_trips():
    trips = db.session.execute(text("""
        SELECT DISTINCT ArchivedTripID, TripName, StartDate, EndDate, Description, DeletedAt
        FROM ArchivedTrip
        ORDER BY DeletedAt DESC
    """)).fetchall()
    
    seen_ids = set()
    seen_names = set()
    result = []
    
    for trip in trips:
        # skip if already seen
        if trip.ArchivedTripID in seen_ids:
            continue
        if trip.TripName in seen_names:
            continue
        
        seen_ids.add(trip.ArchivedTripID)
        seen_names.add(trip.TripName)
        result.append({
            'ArchivedTripID': trip.ArchivedTripID,
            'TripName': trip.TripName,
            'StartDate': trip.StartDate.isoformat() if trip.StartDate else None,
            'EndDate': trip.EndDate.isoformat() if trip.EndDate else None,
            'Description': trip.Description,
            'DeletedAt': trip.DeletedAt.isoformat() if trip.DeletedAt else None
        })
    
    return jsonify(result)
