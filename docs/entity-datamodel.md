//TODO: FIX notation in this diagram.

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
  debtorChangeDate
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
}

class UserRole {

}

class User {
  id
}

Truck --> "1" Route
Route --> "0..*" Refill
Refill --> "1" Location
Refill --> Coupon
Refill ..> FuelType
FuelTank ..> TankType
Refill ..> TankState
Truck "1" <-- Coupon
Region --> "0..*" Location
Region --> "0..*" RegionDailyTemp
Truck --> "0..*" TruckDailyState
TruckDailyState --> "0..*" TruckRefill
TruckRefill ..> FuelType
Region --> "0..*" Street
Debtor "1" -- "*" LocationDebtor
Location "1" -- "*" LocationDebtor
Location --> "1" FuelTank
Location ..> RefillSchedule
LocationHistory ..> RefillSchedule
Location "1" -- "1..*" LocationHistory
LocationDebtor ..> LocationDebtorType

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
