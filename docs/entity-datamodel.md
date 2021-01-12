# Entity Datamodel

## Diagram

```plantuml
@startuml
class Truck {
  id
}

class TruckState {
  id
  morningQuantity
  eveningQuantity
}

class TruckRefill {
  id
  Timestamp
  fuelcardNumber
  amount
}

class Route {
  id
}

class Location {
  id
  type
  tankNumber
}

class Refill {
  id
  amount
  date
  fuelType
  tankState
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

class Coupon {
  couponNumber
}

Truck --> "1" Route
Route --> "0..*" Refill
Refill --> "1" Location
Refill --> Coupon
Refill ..> FuelType
Location ..> TankType
Refill ..> TankState
Truck "1" <-- Coupon
Truck --> "0..*" TruckState
TruckState --> "0..*" TruckRefill
TruckRefill ..> FuelType
@enduml

```

## Entities

### Building

### Coupon

### Refill

### Truck
