# Entity Datamodel

## Diagram

```plantuml
@startuml
class Truck {
  id
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
  startAmount
  endAmount
  date
  fuelType
  tankState
}

class Region {
  id
}

class RegionDailyTemp {
  id
  date
  temperature
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
Region --> "0..*" Location
Region --> "0..*" RegionDailyTemp
@enduml

```

## Entities

### Building

### Coupon

### Refill

### Truck
