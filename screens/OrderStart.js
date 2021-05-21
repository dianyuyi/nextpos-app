import React from 'react'
import {connect} from 'react-redux'
import {clearProduct, getOrdersByDateRange, getTablesAvailable} from '../actions'
import OrderForm from './OrderForm'
import {api, dispatchFetchRequest} from '../constants/Backend'
import {LocaleContext} from '../locales/LocaleContext'
import LoadingScreen from "./LoadingScreen";
import RetailStartOrderForm from './RetailStartOrderForm'

class OrderStart extends React.Component {
  static navigationOptions = {
    header: null
  }
  static contextType = LocaleContext

  constructor(props, context) {
    super(props, context)
  }

  componentDidMount() {
    this.props.getTablesAvailable()
  }

  handleSubmit = values => {

    const createOrder = {}
    createOrder.orderType = values.orderType
    createOrder.tableIds = values?.tableIds
    createOrder.demographicData = {
      male: values.male,
      female: values.female,
      kid: values.kid,
      ageGroup: values.ageGroup,
      visitFrequency: values.visitFrequency
    }

    dispatchFetchRequest(api.order.new, {
      method: 'POST',
      withCredentials: true,
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(createOrder)
    },
      response => {
        response.json().then(data => {
          this.props.navigation.navigate(this.context.appType === 'store' ? 'OrderFormII' : 'RetailOrderForm', {
            orderId: data.orderId,
            route: this.props?.navigation?.state?.params?.route ?? null
          })
        })
      }).then()
  }

  render() {
    const {navigation, isLoading, haveData, availableTables, tableLayouts} = this.props
    const {appType} = this.context
    const initialValues = {
      male: 0,
      female: 0,
      kid: 0
    }


    let tablesMap = {}

    tableLayouts && availableTables && tableLayouts.map(layout => {
      const tables = availableTables[layout.id];

      if (tables !== undefined) {
        tablesMap[layout.layoutName] = tables
      }
    })

    if (isLoading) {
      return (
        <LoadingScreen />
      )
    } else {
      return (
        appType === 'store' ?
          <OrderForm
            onSubmit={this.handleSubmit}
            navigation={navigation}
            tablesMap={tablesMap}
            initialValues={{...initialValues, orderType: navigation?.state?.params?.orderType ?? null}}
          /> :
          <RetailStartOrderForm
            onSubmit={this.handleSubmit}
            navigation={navigation}
            tablesMap={tablesMap}
            initialValues={{...initialValues, orderType: 'TAKE_OUT'}}
          />
      )
    }
  }
}

const mapStateToProps = state => ({
  tableLayouts: state.tablelayouts.data.tableLayouts,
  availableTables: state.tablesavailable.data.availableTables,
  haveData: state.tablesavailable.haveData,
  haveError: state.tablesavailable.haveError,
  isLoading: state.tablesavailable.loading
})

const mapDispatchToProps = dispatch => ({
  clearProduct: () => dispatch(clearProduct()),
  getTablesAvailable: () => dispatch(getTablesAvailable()),
  getOrdersByDateRange: () => dispatch(getOrdersByDateRange())
})
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(OrderStart)
