# Entity Datamodel

## Diagram

```plantuml
@startuml
class Truck {

}

class Route {

}

class Location {
    id 
    type
    address
}

class Refill {
    amount
    couponNumber
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

}

Truck --> "1" Route
Route --> "0..*" Refill 
Refill --> "1" Location
Refill ..> FuelType
Location ..> TankType
Refill ..> TankState
Truck "1" <-- Coupon
@enduml

```

## Entities
### Building
### Coupon 
### Refill
### Truck