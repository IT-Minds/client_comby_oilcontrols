# Entity Datamodel

## Diagram

```plantuml
@startuml
class Truck {

}

class Route {

}

class Location {
    type
    number
}

class Refill {
    amount
    couponNumber
    date
    fuelType
    isTankFull
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

Truck --> "0..*" Route
Route --> "0..*" Location 
Location --> "0..*" Refill
Refill ..> FuelType
Location ..> TankType
@enduml

```

## Entities

### Refill

### Route 
### Tank


