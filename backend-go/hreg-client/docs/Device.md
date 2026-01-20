# Device

## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**DeviceId** | **float32** |  | 
**DeviceName** | **string** |  | 
**Seriennum** | **NullableString** |  | 
**LastDeviceIp** | **NullableString** |  | 
**LastTimeOnline** | **NullableTime** |  | 
**Hwver** | **NullableString** |  | 
**Swver** | **NullableString** |  | 
**CustUserId** | **NullableFloat32** |  | 
**DevtypId** | **NullableFloat32** |  | 
**MbNums** | **NullableString** |  | 
**Action** | **NullableFloat32** |  | 
**MbSerno** | **NullableString** |  | 

## Methods

### NewDevice

`func NewDevice(deviceId float32, deviceName string, seriennum NullableString, lastDeviceIp NullableString, lastTimeOnline NullableTime, hwver NullableString, swver NullableString, custUserId NullableFloat32, devtypId NullableFloat32, mbNums NullableString, action NullableFloat32, mbSerno NullableString, ) *Device`

NewDevice instantiates a new Device object
This constructor will assign default values to properties that have it defined,
and makes sure properties required by API are set, but the set of arguments
will change when the set of required properties is changed

### NewDeviceWithDefaults

`func NewDeviceWithDefaults() *Device`

NewDeviceWithDefaults instantiates a new Device object
This constructor will only assign default values to properties that have it defined,
but it doesn't guarantee that properties required by API are set

### GetDeviceId

`func (o *Device) GetDeviceId() float32`

GetDeviceId returns the DeviceId field if non-nil, zero value otherwise.

### GetDeviceIdOk

`func (o *Device) GetDeviceIdOk() (*float32, bool)`

GetDeviceIdOk returns a tuple with the DeviceId field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetDeviceId

`func (o *Device) SetDeviceId(v float32)`

SetDeviceId sets DeviceId field to given value.


### GetDeviceName

`func (o *Device) GetDeviceName() string`

GetDeviceName returns the DeviceName field if non-nil, zero value otherwise.

### GetDeviceNameOk

`func (o *Device) GetDeviceNameOk() (*string, bool)`

GetDeviceNameOk returns a tuple with the DeviceName field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetDeviceName

`func (o *Device) SetDeviceName(v string)`

SetDeviceName sets DeviceName field to given value.


### GetSeriennum

`func (o *Device) GetSeriennum() string`

GetSeriennum returns the Seriennum field if non-nil, zero value otherwise.

### GetSeriennumOk

`func (o *Device) GetSeriennumOk() (*string, bool)`

GetSeriennumOk returns a tuple with the Seriennum field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetSeriennum

`func (o *Device) SetSeriennum(v string)`

SetSeriennum sets Seriennum field to given value.


### SetSeriennumNil

`func (o *Device) SetSeriennumNil(b bool)`

 SetSeriennumNil sets the value for Seriennum to be an explicit nil

### UnsetSeriennum
`func (o *Device) UnsetSeriennum()`

UnsetSeriennum ensures that no value is present for Seriennum, not even an explicit nil
### GetLastDeviceIp

`func (o *Device) GetLastDeviceIp() string`

GetLastDeviceIp returns the LastDeviceIp field if non-nil, zero value otherwise.

### GetLastDeviceIpOk

`func (o *Device) GetLastDeviceIpOk() (*string, bool)`

GetLastDeviceIpOk returns a tuple with the LastDeviceIp field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetLastDeviceIp

`func (o *Device) SetLastDeviceIp(v string)`

SetLastDeviceIp sets LastDeviceIp field to given value.


### SetLastDeviceIpNil

`func (o *Device) SetLastDeviceIpNil(b bool)`

 SetLastDeviceIpNil sets the value for LastDeviceIp to be an explicit nil

### UnsetLastDeviceIp
`func (o *Device) UnsetLastDeviceIp()`

UnsetLastDeviceIp ensures that no value is present for LastDeviceIp, not even an explicit nil
### GetLastTimeOnline

`func (o *Device) GetLastTimeOnline() time.Time`

GetLastTimeOnline returns the LastTimeOnline field if non-nil, zero value otherwise.

### GetLastTimeOnlineOk

`func (o *Device) GetLastTimeOnlineOk() (*time.Time, bool)`

GetLastTimeOnlineOk returns a tuple with the LastTimeOnline field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetLastTimeOnline

`func (o *Device) SetLastTimeOnline(v time.Time)`

SetLastTimeOnline sets LastTimeOnline field to given value.


### SetLastTimeOnlineNil

`func (o *Device) SetLastTimeOnlineNil(b bool)`

 SetLastTimeOnlineNil sets the value for LastTimeOnline to be an explicit nil

### UnsetLastTimeOnline
`func (o *Device) UnsetLastTimeOnline()`

UnsetLastTimeOnline ensures that no value is present for LastTimeOnline, not even an explicit nil
### GetHwver

`func (o *Device) GetHwver() string`

GetHwver returns the Hwver field if non-nil, zero value otherwise.

### GetHwverOk

`func (o *Device) GetHwverOk() (*string, bool)`

GetHwverOk returns a tuple with the Hwver field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetHwver

`func (o *Device) SetHwver(v string)`

SetHwver sets Hwver field to given value.


### SetHwverNil

`func (o *Device) SetHwverNil(b bool)`

 SetHwverNil sets the value for Hwver to be an explicit nil

### UnsetHwver
`func (o *Device) UnsetHwver()`

UnsetHwver ensures that no value is present for Hwver, not even an explicit nil
### GetSwver

`func (o *Device) GetSwver() string`

GetSwver returns the Swver field if non-nil, zero value otherwise.

### GetSwverOk

`func (o *Device) GetSwverOk() (*string, bool)`

GetSwverOk returns a tuple with the Swver field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetSwver

`func (o *Device) SetSwver(v string)`

SetSwver sets Swver field to given value.


### SetSwverNil

`func (o *Device) SetSwverNil(b bool)`

 SetSwverNil sets the value for Swver to be an explicit nil

### UnsetSwver
`func (o *Device) UnsetSwver()`

UnsetSwver ensures that no value is present for Swver, not even an explicit nil
### GetCustUserId

`func (o *Device) GetCustUserId() float32`

GetCustUserId returns the CustUserId field if non-nil, zero value otherwise.

### GetCustUserIdOk

`func (o *Device) GetCustUserIdOk() (*float32, bool)`

GetCustUserIdOk returns a tuple with the CustUserId field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetCustUserId

`func (o *Device) SetCustUserId(v float32)`

SetCustUserId sets CustUserId field to given value.


### SetCustUserIdNil

`func (o *Device) SetCustUserIdNil(b bool)`

 SetCustUserIdNil sets the value for CustUserId to be an explicit nil

### UnsetCustUserId
`func (o *Device) UnsetCustUserId()`

UnsetCustUserId ensures that no value is present for CustUserId, not even an explicit nil
### GetDevtypId

`func (o *Device) GetDevtypId() float32`

GetDevtypId returns the DevtypId field if non-nil, zero value otherwise.

### GetDevtypIdOk

`func (o *Device) GetDevtypIdOk() (*float32, bool)`

GetDevtypIdOk returns a tuple with the DevtypId field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetDevtypId

`func (o *Device) SetDevtypId(v float32)`

SetDevtypId sets DevtypId field to given value.


### SetDevtypIdNil

`func (o *Device) SetDevtypIdNil(b bool)`

 SetDevtypIdNil sets the value for DevtypId to be an explicit nil

### UnsetDevtypId
`func (o *Device) UnsetDevtypId()`

UnsetDevtypId ensures that no value is present for DevtypId, not even an explicit nil
### GetMbNums

`func (o *Device) GetMbNums() string`

GetMbNums returns the MbNums field if non-nil, zero value otherwise.

### GetMbNumsOk

`func (o *Device) GetMbNumsOk() (*string, bool)`

GetMbNumsOk returns a tuple with the MbNums field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetMbNums

`func (o *Device) SetMbNums(v string)`

SetMbNums sets MbNums field to given value.


### SetMbNumsNil

`func (o *Device) SetMbNumsNil(b bool)`

 SetMbNumsNil sets the value for MbNums to be an explicit nil

### UnsetMbNums
`func (o *Device) UnsetMbNums()`

UnsetMbNums ensures that no value is present for MbNums, not even an explicit nil
### GetAction

`func (o *Device) GetAction() float32`

GetAction returns the Action field if non-nil, zero value otherwise.

### GetActionOk

`func (o *Device) GetActionOk() (*float32, bool)`

GetActionOk returns a tuple with the Action field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetAction

`func (o *Device) SetAction(v float32)`

SetAction sets Action field to given value.


### SetActionNil

`func (o *Device) SetActionNil(b bool)`

 SetActionNil sets the value for Action to be an explicit nil

### UnsetAction
`func (o *Device) UnsetAction()`

UnsetAction ensures that no value is present for Action, not even an explicit nil
### GetMbSerno

`func (o *Device) GetMbSerno() string`

GetMbSerno returns the MbSerno field if non-nil, zero value otherwise.

### GetMbSernoOk

`func (o *Device) GetMbSernoOk() (*string, bool)`

GetMbSernoOk returns a tuple with the MbSerno field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetMbSerno

`func (o *Device) SetMbSerno(v string)`

SetMbSerno sets MbSerno field to given value.


### SetMbSernoNil

`func (o *Device) SetMbSernoNil(b bool)`

 SetMbSernoNil sets the value for MbSerno to be an explicit nil

### UnsetMbSerno
`func (o *Device) UnsetMbSerno()`

UnsetMbSerno ensures that no value is present for MbSerno, not even an explicit nil

[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)


