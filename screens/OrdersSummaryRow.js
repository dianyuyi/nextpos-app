import React from 'react'
import { ScrollView, Text, View, TouchableOpacity } from 'react-native'
import { SwipeListView } from 'react-native-swipe-list-view'
import { connect } from 'react-redux'
import {
  readableDateFormat,
  clearOrder,
  getOrder,
  getfetchOrderInflights, formatDate
} from '../actions'
import BackBtn from '../components/BackBtn'
import AddBtn from '../components/AddBtn'
import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome'
import Icon from 'react-native-vector-icons/Ionicons'
import DeleteBtn from '../components/DeleteBtn'
import {
  api,
  makeFetchRequest,
  errorAlert,
  successMessage,
  warningMessage
} from '../constants/Backend'
import styles from '../styles'

class OrdersSummaryRow extends React.Component {
  constructor(props) {
    super(props)

    console.debug(`order id: ${this.props.order.orderId}`)
  }

  handleCancel = orderId => {
    this.props.clearOrder(orderId)
    this.props.navigation.navigate('TablesSrc')
  }

  handleDeleteLineItem = (orderId, lineItemId) => {
    makeFetchRequest(token => {
      fetch(`${api.apiRoot}/orders/${orderId}/lineitems/${lineItemId}`, {
        method: 'PATCH',
        withCredentials: true,
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer ' + token.access_token
        },
        body: JSON.stringify({ quantity: 0 })
      })
        .then(response => {
          if (response.status === 200) {
            successMessage('Deleted')
            this.props.navigation.navigate('OrdersSummary')
            this.props.getOrder(this.props.order.orderId)
          } else {
            errorAlert(response)
          }
        })
        .catch(error => {
          console.error(error)
        })
    })
  }

  handleComplete = id => {
    makeFetchRequest(token => {
      const formData = new FormData()
      formData.append('action', 'COMPLETED')
      fetch(`${api.apiRoot}/orders/${id}/process?action=COMPLETE`, {
        method: 'POST',
        withCredentials: true,
        credentials: 'include',
        headers: {
          Authorization: 'Bearer ' + token.access_token
        },
        body: formData
      })
        .then(response => response.json())
        .then(res => {
          if (res) {
            this.props.navigation.navigate('TablesSrc')
            this.props.getfetchOrderInflights()
            this.props.clearOrder(id)
          } else {
            alert(res.message === undefined ? 'pls try again' : res.message)
          }
        })
        .catch(error => {
          console.error(error)
        })
    })
  }

  render() {
    const {
      products = [],
      labels = [],
      navigation,
      haveData,
      haveError,
      isLoading,
      label,
      order,
      handleDelete,
      initialValues
    } = this.props

    return (
      <ScrollView>
        <View
          style={{
            marginTop: 62,
            marginLeft: 35,
            marginRight: 35,
            marginBottom: 30
          }}
        >
          <BackBtn />
          <Text
            style={[
              styles.welcomeText,
              styles.orange_color,
              styles.textMedium,
              styles.textBold
            ]}
          >
            Order Summary
          </Text>

          <View style={[styles.flex_dir_row]}>
            <View style={[styles.quarter_width]}>
              <View>
                <Text
                  style={[
                    styles.paddingTopBtn8,
                    styles.textBig,
                    styles.orange_color
                  ]}
                >
                  {this.props.navigation.state.params.tableName === undefined ||
                  this.props.navigation.state.params.tableName == 0
                    ? order.tableInfo.tableName
                    : this.props.navigation.state.params.tableName}
                </Text>
              </View>
            </View>

            <View style={[styles.quarter_width, styles.jc_alignIem_center]}>
              <View>
                <FontAwesomeIcon
                  name="user"
                  size={25}
                  color="#f18d1a"
                  style={[styles.centerText]}
                >
                  <Text style={[styles.textBig, styles.orange_color]}>
                    &nbsp;
                    {!this.props.navigation.state.params.customerCount
                      ? order.demographicData.male +
                        order.demographicData.female +
                        order.demographicData.kid
                      : this.props.navigation.state.params.customerCount}
                  </Text>
                </FontAwesomeIcon>
              </View>
            </View>

            <View style={[styles.fullhalf_width, styles.mgr_20]}>
              <TouchableOpacity>
                <View>
                  <Text style={[styles.toRight, styles.mgr_20]}>
                    Staff - {order.servedBy}
                  </Text>
                  <Text style={[styles.toRight, styles.mgr_20]}>
                    {formatDate(order.createdDate)}
                  </Text>
                </View>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        <View
          style={[
            styles.orange_bg,
            styles.flex_dir_row,
            styles.shoppingBar,
            styles.paddLeft20,
            styles.paddRight20,
            styles.top40
          ]}
        >
          <View style={[styles.quarter_width, styles.jc_alignIem_center]}>
            <TouchableOpacity>
              <Text style={[styles.paddingTopBtn8, styles.whiteColor]}>
                Product
              </Text>
            </TouchableOpacity>
          </View>

          <View style={[styles.quarter_width, styles.jc_alignIem_center]}>
            <TouchableOpacity>
              <Text style={[styles.whiteColor]}>&nbsp;&nbsp;QTY</Text>
            </TouchableOpacity>
          </View>

          <View style={[styles.quarter_width, styles.jc_alignIem_center]}>
            <TouchableOpacity>
              <Text style={styles.whiteColor}>U/P</Text>
            </TouchableOpacity>
          </View>

          <View style={[styles.quarter_width, styles.jc_alignIem_center]}>
            <TouchableOpacity>
              <Text style={styles.whiteColor}>Subtotal</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={[styles.container]}>
          <Text style={styles.textBold}>{order.orderId}</Text>
          {
            // this.props.navigation.state.params.orderState === 'OPEN' &&
            <AddBtn
              onPress={() =>
                this.props.navigation.navigate('OrderFormII', {
                  tableId: this.props.navigation.state.params.tableId,
                  orderId: order.orderId,
                  onSubmit: this.props.navigation.state.params.onSubmit,
                  handleDelete: this.props.navigation.state.params.handleDelete
                })
              }
              disabled={order.state === 'SETTLED' && true}
            />
          }

          <View style={styles.standalone}>
            <SwipeListView
              data={order.lineItems}
              renderItem={(data, rowMap) => (
                <View style={styles.rowFront}>
                  <View key={rowMap}>
                    <View style={[styles.flex_dir_row, styles.paddingTopBtn8]}>
                      <View style={[styles.quarter_width]}>
                        <Text style={{ textAlign: 'left' }}>
                          {data.item.productName}
                        </Text>
                      </View>

                      <View
                        style={[
                          styles.quarter_width,
                          styles.jc_alignIem_center
                        ]}
                      >
                        <Text>&nbsp;&nbsp;{data.item.quantity}</Text>
                      </View>

                      <View
                        style={[
                          styles.quarter_width,
                          styles.jc_alignIem_center
                        ]}
                      >
                        <Text>${data.item.price}</Text>
                      </View>

                      <View
                        style={[
                          styles.quarter_width,
                          styles.jc_alignIem_center
                        ]}
                      >
                        <Text>{data.item.subTotal.amountWithTax}</Text>
                      </View>
                    </View>
                    <View style={[styles.mgrbtn20]}>
                      <Text style={{ textAlign: 'left', marginLeft: 4 }}>
                        {data.item.options}
                      </Text>
                    </View>
                  </View>
                </View>
              )}
              keyExtractor={(data, rowMap) => rowMap.toString()}
              renderHiddenItem={(data, rowMap) => (
                <View style={[styles.rowBack, styles.standalone]} key={rowMap}>
                  <View style={styles.editIcon}>
                    <Icon
                      name="md-create"
                      size={25}
                      color="#fff"
                      onPress={() =>
                        this.props.navigation.navigate('LIneItemEdit', {
                          lineItemId: data.item.lineItemId,
                          orderId: order.orderId,
                          initialValues: data.item
                        })
                      }
                      disabled={order.state === 'DELIVERED' ? true : false}
                    />
                  </View>
                  <View style={styles.delIcon}>
                    <DeleteBtn
                      handleDeleteAction={(orderId, lineItemId) =>
                        this.handleDeleteLineItem(
                          order.orderId,
                          data.item.lineItemId
                        )
                      }
                      screenProps={
                        this.props.navigation.state.params.screenProps
                      }
                      islineItemDelete={true}
                      disabled={order.state === 'DELIVERED' ? true : false}
                    />
                  </View>
                </View>
              )}
              leftOpenValue={0}
              rightOpenValue={-80}
            />
          </View>

          <View
            style={[
              styles.flex_dir_row,
              styles.grayBg,
              styles.paddingTopBtn8,
            ]}
          >
            <View style={[styles.half_width]}>
              <Text>Total</Text>
            </View>
            <View style={[styles.half_width]}>
              <Text style={{ textAlign: 'right', marginRight: -26 }}>
                {order.total.amountWithTax}
              </Text>
            </View>
          </View>

          <View
            style={[
              styles.flex_dir_row,
              styles.grayBg,
              styles.paddingTopBtn8,
            ]}
          >
            <View style={[styles.half_width]}>
              <Text>Service Charge</Text>
            </View>
            <View style={[styles.half_width]}>
              <Text style={{textAlign: 'right', marginRight: -26}}>
                {order.serviceCharge}
              </Text>
            </View>
          </View>

          {order.state === 'OPEN' ? (
            <View
              style={{
                width: '100%',
                borderRadius: 4,
                borderWidth: 1,
                borderColor: '#F39F86',
                backgroundColor: '#F39F86',
                marginRight: '2%',
                marginTop: 22
              }}
            >
              <TouchableOpacity
                onPress={() =>
                  order.lineItems.length == 0
                    ? warningMessage(
                        'At Least One Order Item Need To Proceed..'
                      )
                    : this.props.navigation.state.params.onSubmit(order.orderId)
                }
                // disabled={order.state === 'DELIVERED' ? false : true}
              >
                <Text style={[styles.signInText, styles.whiteColor]}>
                  Submit
                </Text>
              </TouchableOpacity>
            </View>
          ) : order.state === 'IN_PROCESS' ? (
            <View
              style={{
                width: '100%',
                borderRadius: 4,
                borderWidth: 1,
                borderColor: '#F39F86',
                backgroundColor: '#F39F86',
                marginRight: '2%',
                marginTop: 22
              }}
            >
              <TouchableOpacity
                onPress={() =>
                  this.props.navigation.state.params.onSubmit(order.orderId)
                }
                //onPress={this.props.handleSubmit}
              >
                <Text style={[styles.signInText, styles.whiteColor]}>
                  Submit
                </Text>
              </TouchableOpacity>
            </View>
          ) : order.state === 'DELIVERED' ? (
            <View
              style={{
                width: '100%',
                borderRadius: 4,
                borderWidth: 1,
                borderColor: '#F39F86',
                backgroundColor: '#F39F86',
                marginRight: '2%',
                marginTop: 22
              }}
            >
              <TouchableOpacity
                onPress={() =>
                  this.props.navigation.state.params.onSubmit(order.orderId)
                }
                disabled={true}
              >
                <Text style={[styles.signInText, styles.whiteColor]}>
                  Submit
                </Text>
              </TouchableOpacity>
            </View>
          ) : null}

          <View
            style={{
              width: '100%',
              borderRadius: 4,
              borderWidth: 1,
              borderColor: '#F39F86',
              marginTop: 8
            }}
          >
            <TouchableOpacity onPress={() => this.handleCancel(order.orderId)}>
              <Text style={styles.signInText}>Back to Tables</Text>
            </TouchableOpacity>
          </View>

          <View
            style={{
              width: '100%',
              borderRadius: 4,
              borderWidth: 1,
              borderColor: '#F39F86',
              marginTop: 8
            }}
          >
            <TouchableOpacity
              onPress={() => {
                this.props.navigation.state.params.handleDelete(order.orderId)
              }}
            >
              <Text style={styles.signInText}>Delete</Text>
            </TouchableOpacity>
          </View>

          {order.state !== 'SETTLED' &&
            order.state !== 'DELIVERED' &&
            order.state !== 'OPEN' && (
              <View
                style={{
                  width: '100%',
                  borderRadius: 4,
                  borderWidth: 1,
                  borderColor: '#F39F86',
                  marginTop: 8
                }}
              >
                <TouchableOpacity
                  onPress={() => {
                    this.props.navigation.state.params.handleDeliver(
                      order.orderId
                    )
                  }}
                >
                  <Text style={styles.signInText}>Deliver</Text>
                </TouchableOpacity>
              </View>
            )}

          {order.state === 'DELIVERED' && (
            <View
              style={{
                width: '100%',
                borderRadius: 4,
                borderWidth: 1,
                borderColor: '#F39F86',
                marginTop: 8
              }}
            >
              <TouchableOpacity
                onPress={() =>
                  order.lineItems.length == 0
                    ? warningMessage('At Least One Order Item Need Proceed..')
                    : this.props.navigation.navigate('Payment', {
                        order: order
                      })
                }
                //disabled={order.state === 'DELIVERED' ? false : true}
              >
                <Text style={styles.signInText}>Payment</Text>
              </TouchableOpacity>
            </View>
          )}

          {order.state === 'SETTLED' && (
            <View
              style={{
                width: '100%',
                borderRadius: 4,
                borderWidth: 1,
                borderColor: '#F39F86',
                marginTop: 8
              }}
            >
              <TouchableOpacity
                onPress={() => this.handleComplete(order.orderId)}
                //disabled={order.state === 'DELIVERED' ? false : true}
              >
                <Text style={styles.signInText}>Complete</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </ScrollView>
    )
  }
}

const mapDispatchToProps = (dispatch, props) => ({
  clearOrder: () => dispatch(clearOrder(props.order.orderId)),
  getOrder: id => dispatch(getOrder(id)),
  getfetchOrderInflights: () => dispatch(getfetchOrderInflights())
})

export default connect(
  null,
  mapDispatchToProps
)(OrdersSummaryRow)
