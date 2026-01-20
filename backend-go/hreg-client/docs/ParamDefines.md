# ParamDefines

## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**ParamId** | **float32** |  | 
**HregName** | **NullableString** |  | 
**LabelDetail** | **NullableString** |  | 
**LabelChart** | **NullableString** |  | 
**ParamUsage** | **NullableFloat32** |  | 
**UnitDetail** | **NullableString** |  | 
**AttribDetail** | **NullableString** |  | 
**Access** | **NullableString** |  | 

## Methods

### NewParamDefines

`func NewParamDefines(paramId float32, hregName NullableString, labelDetail NullableString, labelChart NullableString, paramUsage NullableFloat32, unitDetail NullableString, attribDetail NullableString, access NullableString, ) *ParamDefines`

NewParamDefines instantiates a new ParamDefines object
This constructor will assign default values to properties that have it defined,
and makes sure properties required by API are set, but the set of arguments
will change when the set of required properties is changed

### NewParamDefinesWithDefaults

`func NewParamDefinesWithDefaults() *ParamDefines`

NewParamDefinesWithDefaults instantiates a new ParamDefines object
This constructor will only assign default values to properties that have it defined,
but it doesn't guarantee that properties required by API are set

### GetParamId

`func (o *ParamDefines) GetParamId() float32`

GetParamId returns the ParamId field if non-nil, zero value otherwise.

### GetParamIdOk

`func (o *ParamDefines) GetParamIdOk() (*float32, bool)`

GetParamIdOk returns a tuple with the ParamId field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetParamId

`func (o *ParamDefines) SetParamId(v float32)`

SetParamId sets ParamId field to given value.


### GetHregName

`func (o *ParamDefines) GetHregName() string`

GetHregName returns the HregName field if non-nil, zero value otherwise.

### GetHregNameOk

`func (o *ParamDefines) GetHregNameOk() (*string, bool)`

GetHregNameOk returns a tuple with the HregName field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetHregName

`func (o *ParamDefines) SetHregName(v string)`

SetHregName sets HregName field to given value.


### SetHregNameNil

`func (o *ParamDefines) SetHregNameNil(b bool)`

 SetHregNameNil sets the value for HregName to be an explicit nil

### UnsetHregName
`func (o *ParamDefines) UnsetHregName()`

UnsetHregName ensures that no value is present for HregName, not even an explicit nil
### GetLabelDetail

`func (o *ParamDefines) GetLabelDetail() string`

GetLabelDetail returns the LabelDetail field if non-nil, zero value otherwise.

### GetLabelDetailOk

`func (o *ParamDefines) GetLabelDetailOk() (*string, bool)`

GetLabelDetailOk returns a tuple with the LabelDetail field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetLabelDetail

`func (o *ParamDefines) SetLabelDetail(v string)`

SetLabelDetail sets LabelDetail field to given value.


### SetLabelDetailNil

`func (o *ParamDefines) SetLabelDetailNil(b bool)`

 SetLabelDetailNil sets the value for LabelDetail to be an explicit nil

### UnsetLabelDetail
`func (o *ParamDefines) UnsetLabelDetail()`

UnsetLabelDetail ensures that no value is present for LabelDetail, not even an explicit nil
### GetLabelChart

`func (o *ParamDefines) GetLabelChart() string`

GetLabelChart returns the LabelChart field if non-nil, zero value otherwise.

### GetLabelChartOk

`func (o *ParamDefines) GetLabelChartOk() (*string, bool)`

GetLabelChartOk returns a tuple with the LabelChart field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetLabelChart

`func (o *ParamDefines) SetLabelChart(v string)`

SetLabelChart sets LabelChart field to given value.


### SetLabelChartNil

`func (o *ParamDefines) SetLabelChartNil(b bool)`

 SetLabelChartNil sets the value for LabelChart to be an explicit nil

### UnsetLabelChart
`func (o *ParamDefines) UnsetLabelChart()`

UnsetLabelChart ensures that no value is present for LabelChart, not even an explicit nil
### GetParamUsage

`func (o *ParamDefines) GetParamUsage() float32`

GetParamUsage returns the ParamUsage field if non-nil, zero value otherwise.

### GetParamUsageOk

`func (o *ParamDefines) GetParamUsageOk() (*float32, bool)`

GetParamUsageOk returns a tuple with the ParamUsage field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetParamUsage

`func (o *ParamDefines) SetParamUsage(v float32)`

SetParamUsage sets ParamUsage field to given value.


### SetParamUsageNil

`func (o *ParamDefines) SetParamUsageNil(b bool)`

 SetParamUsageNil sets the value for ParamUsage to be an explicit nil

### UnsetParamUsage
`func (o *ParamDefines) UnsetParamUsage()`

UnsetParamUsage ensures that no value is present for ParamUsage, not even an explicit nil
### GetUnitDetail

`func (o *ParamDefines) GetUnitDetail() string`

GetUnitDetail returns the UnitDetail field if non-nil, zero value otherwise.

### GetUnitDetailOk

`func (o *ParamDefines) GetUnitDetailOk() (*string, bool)`

GetUnitDetailOk returns a tuple with the UnitDetail field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetUnitDetail

`func (o *ParamDefines) SetUnitDetail(v string)`

SetUnitDetail sets UnitDetail field to given value.


### SetUnitDetailNil

`func (o *ParamDefines) SetUnitDetailNil(b bool)`

 SetUnitDetailNil sets the value for UnitDetail to be an explicit nil

### UnsetUnitDetail
`func (o *ParamDefines) UnsetUnitDetail()`

UnsetUnitDetail ensures that no value is present for UnitDetail, not even an explicit nil
### GetAttribDetail

`func (o *ParamDefines) GetAttribDetail() string`

GetAttribDetail returns the AttribDetail field if non-nil, zero value otherwise.

### GetAttribDetailOk

`func (o *ParamDefines) GetAttribDetailOk() (*string, bool)`

GetAttribDetailOk returns a tuple with the AttribDetail field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetAttribDetail

`func (o *ParamDefines) SetAttribDetail(v string)`

SetAttribDetail sets AttribDetail field to given value.


### SetAttribDetailNil

`func (o *ParamDefines) SetAttribDetailNil(b bool)`

 SetAttribDetailNil sets the value for AttribDetail to be an explicit nil

### UnsetAttribDetail
`func (o *ParamDefines) UnsetAttribDetail()`

UnsetAttribDetail ensures that no value is present for AttribDetail, not even an explicit nil
### GetAccess

`func (o *ParamDefines) GetAccess() string`

GetAccess returns the Access field if non-nil, zero value otherwise.

### GetAccessOk

`func (o *ParamDefines) GetAccessOk() (*string, bool)`

GetAccessOk returns a tuple with the Access field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetAccess

`func (o *ParamDefines) SetAccess(v string)`

SetAccess sets Access field to given value.


### SetAccessNil

`func (o *ParamDefines) SetAccessNil(b bool)`

 SetAccessNil sets the value for Access to be an explicit nil

### UnsetAccess
`func (o *ParamDefines) UnsetAccess()`

UnsetAccess ensures that no value is present for Access, not even an explicit nil

[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)


