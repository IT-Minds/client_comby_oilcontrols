# Auth

## Actions

List of actions defined under `Domain.Enums.Action` and their related commands.

### 0 ASSIGN_COUPON

- `AssignCouponsCommand`

### 1 SAVE_COUPON_IMAGE

- `SaveCouponImageCommand`

### 2 UPDATE_COUPON_STATUS

- `UpdateCouponStatusCommand`

### 3 GET_COUPONS

- `GetCouponImageQuery`
- `GetCouponsTruckQuery`

### 4 SET_TEMPERATURE

- `CreateDailyTemperatureCommand`

### 5 GET_DEBTOR

- `GetDebtorQuery`
- `GetDebtorHistoryQuery`
- `GetDebtorsQuery`

### 6 GET_LOCATION_HISTORIES

- `GetAllLocationHistoriesQuery`
- `GetLocationHistoryQuery`

### 7 CREATE_LOCATION

- `CreateLocationCommand`

### 8 UPDATE_LOCATION

- `AddDebtorToLocationCommand`
- `AddLocationImageCommand`
- `UpdateDebtorOnLocationCommand`
- `UpdateLocationMetaDataCommand`
- `RemoveDebtorFromLocationCommand`

### 9 GET_LOCATION

- `GetDebtorHistoryQuery`
- `GetLocationImageQuery`
- `GetLocationRequiringRefill`
- `GetHistoricConsumptionCsvQuery`
- `GetHistoricConsumptionQuery`

### 10 COMPLETE_REFILL

- `CompleteRefillCommand`

### 11 ORDER_REFILL

- `OrderRefillCommand`

### 12 GET_REFILLS

- `GetLocationRefillHistoryQuery`
- `GetRefillsLocationQuery`
- `GetTruckRefillHistoryQuery`
- `GetRefillOfYearQuery`

### 13 GET_STREETS

- `GetStreetsQuery`

### 14 CREATE_TRUCK_REFILL

- `CreateTruckRefillCommand`

### 15 CREATE_TRUCK

- `CreateTruckCommand`

### 16 UPDATE_TRUCK

- `UpdateTruckCommand`

### 17 GET_TRUCK

- `GetTrucksPageQuery`
- `GetTruckInfoQuery`

### 18 GET_ROLES

- `GetRoleQuery`
- `GetAllRolesQuery`

### 19 UPDATE_USER

- `UpdatePasswordCommand`
- `UpdateUserRolesCommand`

### 20 GET_ALL_USERS

- `GetAllUsersQuery`

### 21 SET_DEBTOR_COUPON_REQUIRED

- `PrintCouponRequiredCommand`

### 22 CREATE_ROLE

- `CreateRoleCommand`

### 23 UPDATE_ROLE

- `UpdateRoleCommand`

### 24 DELETE_USER

- `DeleteUserCommand`

### 25 CREATE_USER

- `CreateUserCommand`

## Pages

### MyTruck

Full action list:

14 CREATE_TRUCK_REFILL
17 GET_TRUCK
3 GET_COUPONS
9 GET_LOCATION
1 SAVE_COUPON_IMAGE
