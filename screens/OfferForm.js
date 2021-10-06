import React from "react";
import {Field, reduxForm, formValueSelector} from "redux-form";
import {connect} from 'react-redux';
import {Platform, Text, TouchableOpacity, View} from "react-native";
import {isRequired} from "../validators";
import InputText from "../components/InputText";
import {LocaleContext} from "../locales/LocaleContext";
import styles from "../styles";
import RNSwitch from "../components/RNSwitch";
import DeleteBtn from "../components/DeleteBtn";
import RenderDateTimePicker from "../components/DateTimePicker";
import SegmentedControl from "../components/SegmentedControl";
import AntDesignIcon from "react-native-vector-icons/AntDesign";
import RenderPureCheckBox from "../components/rn-elements/PureCheckBox";
import {api, dispatchFetchRequest} from "../constants/Backend";
import {StyledText} from "../components/StyledText";
import {parse} from "expo-linking";

class OfferForm extends React.Component {
  static navigationOptions = {
    header: null
  };
  static contextType = LocaleContext;

  constructor(props, context) {
    super(props, context);

    const initialValues = this.props.initialValues
    const selectedOfferIdx = initialValues?.offerType === 'ORDER' ? 0 : 1;
    const selectedTriggerTypeIdx = initialValues?.triggerType === 'AT_CHECKOUT' ? 0 : 1;
    let appliesToAllProducts = false

    if (initialValues !== undefined && initialValues.offerType === 'PRODUCT' && initialValues.productOfferDetails.appliesToAllProducts) {
      appliesToAllProducts = true
    }

    this.state = {
      appliesToAllProducts: appliesToAllProducts,
      selectedOfferType: selectedOfferIdx,
      selectedTriggerType: selectedTriggerTypeIdx,
      triggerTypes: {
        0: {label: context.t('triggerTypeName.AT_CHECKOUT'), value: 'AT_CHECKOUT'},
        1: {label: context.t('triggerTypeName.ALWAYS'), value: 'ALWAYS'}
      },
      offerTypes: {
        0: {label: context.t('offerTypeName.ORDER'), value: 'ORDER'},
        1: {label: context.t('offerTypeName.PRODUCT'), value: 'PRODUCT'}
      },
      products: [],
      uniqueProducts: [],
      dateBound: initialValues.dateBound,
      from: {
        show: false
      },
      to: {
        show: false
      },
      offerStartDate: initialValues.startDate ?? null,
      offerEndDate: initialValues.endDate ?? null,
    };
  }

  componentDidMount() {

    if (this.props.isEditForm) {
      let selectedProducts = this.props.initialValues.productOfferDetails !== null ? this.props.initialValues.productOfferDetails.selectedProducts : [];

      this.setState({
        products: this.props.selectedProducts !== undefined ? this.props.selectedProducts : selectedProducts
      });
    }
    if (!!this.props?.initialValues?.startDate) {
      this.props?.change(`startDate`, new Date(this.props.initialValues?.startDate))
      this.props?.change(`endDate`, new Date(this.props.initialValues?.endDate))
    }
  }

  handlegetStartDate = (event, selectedDate) => {
    console.log(`selected datetime: ${selectedDate}`);
    this.setState({offerStartDate: new Date(selectedDate), offerEndDate: new Date(selectedDate)})
    this.props?.change(`startDate`, new Date(selectedDate))
    this.props?.change(`endDate`, new Date(selectedDate))
  };
  handlegetEndDate = (event, selectedDate) => {
    console.log(`selected datetime: ${selectedDate}`);
    this.setState({offerEndDate: new Date(selectedDate)})
    this.props?.change(`endDate`, new Date(selectedDate))
  };

  showDatepicker = which => {
    if (which === "from") {
      this.setState({
        from: {
          show: !this.state.from.show
        }
      });
    } else if (which === "to") {
      this.setState({
        to: {
          show: !this.state.to.show
        }
      });
    }
  };

  toggleSwitch = () => {
    this.setState({
      appliesToAllProducts: !this.state.appliesToAllProducts
    });
  };

  handleDelete = productId => {
    dispatchFetchRequest(
      api.product.delete(productId),
      {
        method: "DELETE",
        withCredentials: true,
        credentials: "include",
        headers: {
          "Content-Type": "application/json"
        }
      },
      response => {
        this.props.navigation.navigate("ManageOffers");
      }
    ).then();
  };

  handleIndexChange = index => {
    this.setState({
      selectedOfferType: index
    });
  };

  removeArrayItem = productId => {
    const updatedItems = this.state.products.filter(item => {
      return item.productId !== productId;
    });
    this.setState({
      products: updatedItems
    });
  };

  componentDidUpdate() {
    if (this.props.onChange) {
      this.props.onChange(this.state);
    }

  }

  render() {
    const {
      handleSubmit,
      isEditForm,
      handleEditCancel,
      onCancel,
      handleDeleteOffer,
      selectedProducts,
      initialValues,
      handleActivate,
      handleDeactivate
    } = this.props;
    const {t, customMainThemeColor} = this.context;
    const {appliesToAllProducts, products} = this.state;


    const triggerTypes = Object.keys(this.state.triggerTypes).map(key => this.state.triggerTypes[key].label)
    const offerTypes = Object.keys(this.state.offerTypes).map(key => this.state.offerTypes[key].label)

    return (
      <View>
        <View style={styles.tableRowContainerWithBorder}>
          <View style={[styles.tableCellView, {flex: 1}]}>
            <StyledText style={styles.fieldTitle}>{t("offerName")}</StyledText>
          </View>
          <View style={[styles.tableCellView, styles.justifyRight, {flex: 3}]}>
            <Field
              name="offerName"
              component={InputText}
              placeholder={t("offerName")}
              secureTextEntry={false}
              validate={isRequired}
            />
          </View>
        </View>

        <View style={styles.tableRowContainerWithBorder}>
          <View style={[{flex: 1}]}>
            <StyledText style={styles.fieldTitle}>{t("triggerType")}</StyledText>
          </View>
          <View style={[styles.justifyRight, {flex: 3}]}>
            <Field
              name="triggerType"
              component={SegmentedControl}
              selectedIndex={this.state.selectedTriggerType}
              values={triggerTypes}
              onChange={(index) => this.setState({selectedTriggerType: index})}
              normalize={value => {
                return this.state.triggerTypes[value].value
              }}
            />
          </View>
        </View>

        {isEditForm && (
          <View style={styles.tableRowContainerWithBorder}>
            <View style={[styles.tableCellView, {flex: 1}]}>
              <StyledText style={styles.fieldTitle}>{t("offerStatus")}</StyledText>
            </View>
            <View style={[styles.tableCellView, styles.justifyRight]}>
              <StyledText style={styles.fieldTitle}>{initialValues.active ? t('active') : t('inactive')}</StyledText>
            </View>
          </View>
        )}

        <View style={styles.tableRowContainerWithBorder}>
          <View style={[styles.tableCellView, {flex: 1}]}>
            <StyledText style={styles.fieldTitle}>{t("dateBound")}</StyledText>
          </View>
          <View style={[styles.tableCellView, styles.justifyRight]}>
            <Field
              name="dateBound"
              component={RNSwitch}
              onChange={(value) => {
                this.setState({
                  dateBound: value
                })
              }}
            />
          </View>
        </View>

        <View style={[styles.tableRowContainer]}>
          <View style={[styles.tableCellView, {flex: 2}]}>
            <Field
              name="startDate"
              component={RenderDateTimePicker}
              onChange={this.handlegetStartDate}
              defaultValue={this.state?.startDate ?? new Date()}
              placeholder={t("order.date")}
              isShow={this.state.from.show}
              showDatepicker={() => this.showDatepicker("from")}
              readonly={!this.state.dateBound}
            />
          </View>
          <View
            style={[
              styles.tableCellView,
              {flex: 0.2, justifyContent: "center"}
            ]}
          >
            <Text>-</Text>
          </View>
          <View style={[styles.tableCellView, {flex: 2}]}>
            <Field
              name="endDate"
              component={RenderDateTimePicker}
              onChange={this.handlegetEndDate}
              defaultValue={this.state?.endDate ?? new Date()}
              placeholder={t("order.date")}
              isShow={this.state.to.show}
              showDatepicker={() => this.showDatepicker("to")}
              readonly={!this.state.dateBound}
            />
          </View>
        </View>


        <View style={[styles.sectionContainer, styles.horizontalMargin,]}>
          <View style={[styles.sectionContainer]}>
            <View style={styles.sectionTitleContainer}>
              <StyledText style={styles.sectionTitleText}>{t("offerType")}</StyledText>
            </View>

            <View style={[styles.sectionContainer]}>
              <View>
                <Field
                  name="offerType"
                  component={SegmentedControl}
                  selectedIndex={this.state.selectedOfferType}
                  values={offerTypes}
                  enabled={!isEditForm}
                  onChange={this.handleIndexChange}
                  normalize={value => {
                    return this.state.offerTypes[value].value
                  }}
                />
              </View>
            </View>
            {this.state.selectedOfferType === 1 && (
              <View
                style={[
                  styles.tableRowContainerWithBorder,
                ]}
              >
                <View style={[styles.tableCellView, {flex: 3}]}>
                  <StyledText style={styles.fieldTitle}>{t("applyToAll")}</StyledText>
                </View>
                <View style={[styles.tableCellView, styles.justifyRight]}>
                  <Field
                    name="productOfferDetails.appliesToAllProducts"
                    component={RNSwitch}
                    onChange={this.toggleSwitch}
                  />
                </View>
              </View>
            )}

            {this.state.selectedOfferType === 1 && !appliesToAllProducts && (
              <View style={[styles.sectionContent]}>
                <View style={[styles.tableRowContainer]}>
                  <AntDesignIcon
                    name={"pluscircle"}
                    size={22}
                    color={customMainThemeColor}
                    style={[{transform: [{rotateY: "180deg"}], }, styles.justifyRight]}
                    onPress={() =>
                      this.props.navigation.navigate("ProductsOverviewforOffer", {
                        isEditForm: isEditForm,
                        updatedselectedProducts: this.state.products
                      }
                      )
                    }
                  />
                </View>
                {products !== undefined &&
                  products.map(selectedProduct => (
                    <View style={[styles.tableRowContainerWithBorder]}
                      key={selectedProduct.productId}
                    >
                      <View style={[styles.tableCellView]}>
                        <StyledText>{selectedProduct.name}</StyledText>
                      </View>
                      <View style={[styles.tableCellView, styles.justifyRight]}>
                        <TouchableOpacity
                          onPress={() =>
                            this.removeArrayItem(selectedProduct.productId)
                          }
                        >
                          <AntDesignIcon
                            name={"closecircle"}
                            size={22}
                            color={"#dc3545"}
                            style={{
                              transform: [{rotateY: "180deg"}],
                            }}
                          />
                        </TouchableOpacity>
                      </View>
                    </View>
                  ))}
              </View>
            )}
          </View>
        </View>

        <View style={[styles.sectionContainer]}>
          <View style={[styles.sectionTitleContainer, {flex: 1}]}>
            <StyledText style={styles.sectionTitleText}>{t("discountType")}</StyledText>
          </View>

          <View style={styles.tableCellView}>
            <View style={{flex: 1}}>
              <Field
                name="discountType"
                component={RenderPureCheckBox}
                customValue="AMOUNT_OFF"
                isIconAsTitle={false}
                title={t("amountOff")}
                validate={isRequired}
              />
            </View>

            <View style={{flex: 1}}>
              <Field
                name="discountType"
                component={RenderPureCheckBox}
                customValue="PERCENT_OFF"
                isIconAsTitle={false}
                title={t("percentOff")}
              />
            </View>
          </View>

          <View style={styles.tableRowContainer}>
            <View style={[styles.tableCellView, {flex: 1}]}>
              <StyledText style={styles.fieldTitle}>{t("discountValue")}</StyledText>
            </View>
            <View style={[styles.tableCellView, styles.flex(1), styles.justifyRight]}>
              {this.props?.discountType && this.props?.discountType === 'AMOUNT_OFF' ?
                <Field
                  name="discountValue"
                  component={InputText}
                  placeholder={t("discountValue")}
                  secureTextEntry={false}
                  keyboardType='numeric'
                  validate={isRequired}
                /> :
                <>
                  <Field
                    name="discountValue"
                    component={InputText}
                    placeholder={t("discountValue")}
                    secureTextEntry={false}
                    keyboardType='numeric'
                    validate={isRequired}
                    format={(value, name) => {
                      return (value !== undefined && value !== null) ? parseInt(value * 100) : null
                    }}
                    normalize={(newValue, prevValue) => {
                      if (isNaN(newValue)) {newValue = prevValue}
                      return (newValue / 100)
                    }}
                  />
                  <StyledText style={{paddingLeft: 4}}>{'%'}</StyledText>
                </>
              }
            </View>
          </View>
        </View>



        <View style={[styles.bottom, styles.horizontalMargin]}>
          <TouchableOpacity onPress={handleSubmit}>
            <Text style={[styles?.bottomActionButton(customMainThemeColor), styles?.actionButton(customMainThemeColor)]}>
              {t("action.save")}
            </Text>
          </TouchableOpacity>

          {isEditForm && (
            <View>
              {!initialValues.active ? (
                <TouchableOpacity
                  onPress={() => handleActivate(initialValues.offerId)}
                >
                  <Text style={[styles?.bottomActionButton(customMainThemeColor), styles?.actionButton(customMainThemeColor)]}>
                    {t("action.activate")}
                  </Text>
                </TouchableOpacity>
              ) : (
                  <TouchableOpacity
                    onPress={() => handleDeactivate(initialValues.offerId)}
                  >
                    <Text style={[styles?.bottomActionButton(customMainThemeColor), styles?.actionButton(customMainThemeColor)]}>
                      {t("action.deactivate")}
                    </Text>
                  </TouchableOpacity>
                )}
            </View>
          )}

          <TouchableOpacity onPress={handleEditCancel}>
            <Text style={[styles?.bottomActionButton(customMainThemeColor), styles?.secondActionButton(this.context)]}>
              {t("action.cancel")}
            </Text>
          </TouchableOpacity>

          {isEditForm && (
            <DeleteBtn handleDeleteAction={handleDeleteOffer} />
          )}

        </View>
      </View>
    );
  }
}

OfferForm = reduxForm({
  form: "newOffOfferFormerForm"
})(OfferForm);

const selector = formValueSelector('newOffOfferFormerForm')

OfferForm = connect(state => {
  const discountType = selector(state, 'discountType')
  return {
    discountType
  }
}
)(OfferForm)

export default OfferForm;
