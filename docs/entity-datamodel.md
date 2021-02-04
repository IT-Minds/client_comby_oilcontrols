# Entity Datamodel

## Diagram

```plantuml
@startuml
class Truck {
  id
  truckIdentifier
  truckNumber
  name
  description
  tankCapacity
}

class Route {
  id
}

class Location {
  id
  address
  comment
  refillSchedule
  daysBetweenRefills
  estimateFuelConsumption
  currentDebtorId
  upcomingDebtorId
}

class LocationHistory {
  id
  address
  comment
  refillSchedule
}

class FuelTank {
  id
  type
  tankNumber
  tankCapacity
  minimumFuelAmount
}

class Refill {
  id
  startAmount
  endAmount
  expectedDeliveryDate
  actualDeliveryDate
  fuelType
  tankState
  refillNumber
}

class Region {
  id
}

class RegionDailyTemp {
  id
  date
  temperature
}

class TruckDailyState {
  id
  date
  morningQuantity
  eveningQuantity
  startRefillNumber
}

class TruckRefill {
  id
  Timestamp
  fuelcardNumber
  amount
}

class Street {
  id
  name
}

class Debtor {
  id
  couponRequired
}

class LocationDebtor {

}

enum FuelType {
  OIL
  PETROLEUM
  GASOLINE
  OTHER
}

enum TankType {
  BUILDING
  TANK
  SHIP
}

enum TankState {
  EMPTY
  FULL
  PARTIALLY_FILLED
}

enum RefillSchedule {
  AUTOMATIC
  INTERVAL
  MANUAL
}

class Coupon {
  couponNumber
}

enum LocationDebtorType {
  MAIN
  BASE
  UPCOMING
}

enum Action {

}

class RoleAction {

}

class Role {
  id
  name
}

class UserRole {

}

class User {
  id
}

class LocationDebtorHistory {

}

Truck "1" -- "1" Route
Route "1" -- "0..*" Refill
Refill "*" -- "1" Location
Refill "1" -- "1" Coupon
Refill ..> FuelType
FuelTank ..> TankType
Refill ..> TankState
Truck "1" -- "*" Coupon
Region "1" -- "0..*" Location
Region "1" -- "0..*" RegionDailyTemp
Truck "1" -- "0..*" TruckDailyState
TruckDailyState "1" -- "0..*" TruckRefill
TruckRefill ..> FuelType
Region "1" -- "0..*" Street
Debtor "1" -- "*" LocationDebtor
Location "1" -- "0..3" LocationDebtor
Location "1" -- "1" FuelTank
Location ..> RefillSchedule
LocationHistory ..> RefillSchedule
Location "1" -- "1..*" LocationHistory
LocationDebtor ..> LocationDebtorType
Location "1" -- "0..*" LocationDebtorHistory
LocationDebtorHistory "*" -- "1" Debtor
LocationDebtorHistory ..> LocationDebtorType

Action "1" -- "*" RoleAction
Role "1" -- "*" RoleAction
Role "1" -- "*" UserRole
User "1" -- "*" UserRole
@enduml

```

## Entities

### Building

### Coupon

### Refill

### Truck
