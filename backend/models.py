import datetime
from flask_sqlalchemy import SQLAlchemy
from datetime import datetime


db = SQLAlchemy()

class Booking(db.Model):
    __tablename__ = 'Booking'

    BookingID = db.Column(db.Integer, primary_key=True, autoincrement=True)
    TripID = db.Column(db.Integer, db.ForeignKey('Trip.TripID'), nullable=False)
    BookingType = db.Column(db.String(100), nullable=False)
    BookingDate = db.Column(db.Date, nullable=False)
    Cost = db.Column(db.Numeric(10, 2), nullable=False)
    Currency = db.Column(db.String(50), nullable=False)

class Currency(db.Model):
    __tablename__ = 'Currency'

    Date = db.Column(db.Date, primary_key=True)
    BaseCurrency = db.Column(db.String(50), primary_key=True)
    TargetCurrency = db.Column(db.String(50), primary_key=True)
    Rate = db.Column(db.Numeric(10, 4), nullable=False)

class Expense(db.Model):
    __tablename__ = 'Expense'

    ExpenseID = db.Column(db.Integer, primary_key=True, autoincrement=True)
    TripID = db.Column(db.Integer, db.ForeignKey('Trip.TripID'), nullable=False)
    Date = db.Column(db.Date, nullable=False)
    Amount = db.Column(db.Numeric(10, 2), nullable=False)
    Currency = db.Column(db.String(50), nullable=False)
    CategoryName = db.Column(db.String(100), nullable=False)
    Description = db.Column(db.Text, nullable=True)

class Trip(db.Model):
    __tablename__ = 'Trip'

    TripID = db.Column(db.Integer, primary_key=True, autoincrement=True)
    TripName = db.Column(db.String(255), nullable=False)
    StartDate = db.Column(db.Date, nullable=False)
    EndDate = db.Column(db.Date, nullable=False)
    Description = db.Column(db.Text, nullable=True)

class TripUser(db.Model):
    __tablename__ = 'TripUser'

    TripID = db.Column(db.Integer, db.ForeignKey('Trip.TripID'), primary_key=True)
    UserID = db.Column(db.Integer, db.ForeignKey('User.UserID'), primary_key=True)
    PermissionLevel = db.Column(db.String(50), nullable=False)

class User(db.Model):
    __tablename__ = 'User'

    UserID = db.Column(db.Integer, primary_key=True, autoincrement=True)
    Username = db.Column(db.String(255), nullable=False)
    Password = db.Column(db.String(255), nullable=False)
    Email = db.Column(db.String(255), nullable=False)
    HomeCurrency = db.Column(db.String(50), nullable=False)

class ArchivedTrip(db.Model):
    __tablename__ = 'ArchivedTrip'

    ArchivedTripID = db.Column(db.Integer, primary_key=True, autoincrement=True)
    TripID = db.Column(db.Integer)
    TripName = db.Column(db.String(255))
    StartDate = db.Column(db.Date)
    EndDate = db.Column(db.Date)
    Description = db.Column(db.Text)
    DeletedAt = db.Column(db.DateTime, default=datetime.utcnow)

