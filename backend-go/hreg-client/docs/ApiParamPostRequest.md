# ApiParamPostRequest

## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**DeviceId** | **float32** |  | 
**ParamId** | **float32** |  | 
**ValueStr** | **string** |  | 

## Methods

### NewApiParamPostRequest

`func NewApiParamPostRequest(deviceId float32, paramId float32, valueStr string, ) *ApiParamPostRequest`

NewApiParamPostRequest instantiates a new ApiParamPostRequest object
This constructor will assign default values to properties that have it defined,
and makes sure properties required by API are set, but the set of arguments
will change when the set of required properties is changed

### NewApiParamPostRequestWithDefaults

`func NewApiParamPostRequestWithDefaults() *ApiParamPostRequest`

NewApiParamPostRequestWithDefaults instantiates a new ApiParamPostRequest object
This constructor will only assign default values to properties that have it defined,
but it doesn't guarantee that properties required by API are set

### GetDeviceId

`func (o *ApiParamPostRequest) GetDeviceId() float32`

GetDeviceId returns the DeviceId field if non-nil, zero value otherwise.

### GetDeviceIdOk

`func (o *ApiParamPostRequest) GetDeviceIdOk() (*float32, bool)`

GetDeviceIdOk returns a tuple with the DeviceId field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetDeviceId

`func (o *ApiParamPostRequest) SetDeviceId(v float32)`

SetDeviceId sets DeviceId field to given value.


### GetParamId

`func (o *ApiParamPostRequest) GetParamId() float32`

GetParamId returns the ParamId field if non-nil, zero value otherwise.

### GetParamIdOk

`func (o *ApiParamPostRequest) GetParamIdOk() (*float32, bool)`

GetParamIdOk returns a tuple with the ParamId field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetParamId

`func (o *ApiParamPostRequest) SetParamId(v float32)`

SetParamId sets ParamId field to given value.


### GetValueStr

`func (o *ApiParamPostRequest) GetValueStr() string`

GetValueStr returns the ValueStr field if non-nil, zero value otherwise.

### GetValueStrOk

`func (o *ApiParamPostRequest) GetValueStrOk() (*string, bool)`

GetValueStrOk returns a tuple with the ValueStr field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetValueStr

`func (o *ApiParamPostRequest) SetValueStr(v string)`

SetValueStr sets ValueStr field to given value.



[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)


