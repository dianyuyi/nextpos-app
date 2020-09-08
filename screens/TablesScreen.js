import React, {Component, useContext} from 'react'
import {Animated, PanResponder, FlatList, RefreshControl, Text, TouchableOpacity, View, Dimensions} from 'react-native'
import {connect} from 'react-redux'
import AddBtn from '../components/AddBtn'
import OrderStart from './OrderStart'
import OrderItem from './OrderItem'
import {getfetchOrderInflights, getMostRecentShiftStatus, getShiftStatus, getTableLayouts, getTablesAvailable, } from '../actions'
import styles, {mainThemeColor} from '../styles'
import {successMessage} from '../constants/Backend'
import {LocaleContext} from '../locales/LocaleContext'
import {handleDelete, handleOrderSubmit} from '../helpers/orderActions'
import {NavigationEvents} from "react-navigation";
import {handleOpenShift} from "../helpers/shiftActions";
import {getCurrentClient} from "../actions/client";
import LoadingScreen from "./LoadingScreen";
import ScreenHeader from "../components/ScreenHeader";
import {ThemeContainer} from "../components/ThemeContainer";
import {ThemeScrollView} from "../components/ThemeScrollView";
import {StyledText} from "../components/StyledText";
import {withContext} from "../helpers/contextHelper";
import {compose} from "redux";
import StyledTextInput from "../components/StyledTextInput";
import {withAnchorPoint} from 'react-native-anchor-point';
import * as Device from 'expo-device';
import {style} from 'd3';
import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome';
import TimeAgo from 'javascript-time-ago';
import {getTimeDifference} from '../actions';
import en from 'javascript-time-ago/locale/en';
import NewOrderModal from './NewOrderModal';

class TablesScreen extends React.Component {
  static navigationOptions = {
    header: null
  }
  static contextType = LocaleContext

  constructor(props, context) {
    super(props, context)

    const windowWidth = Dimensions.get('window').width - 30;
    const windowHeight = Dimensions.get('window').height - 76;
    console.log("SCREEN SIZE", context?.isTablet);

    this.state = {
      openBalance: 0,
      refreshing: false,
      windowWidth: Dimensions.get('window').width - 30,
      windowHeight: Dimensions.get('window').height - 76,
      scaleMultiple: (Dimensions.get('window').width - 30) / 300,
      tableIndex: 0,
      isTablet: context?.isTablet,
      themeStyle: context?.themeStyle,
      modalVisible: false,
      orderModalData: {}
    }
  }

  componentDidMount() {
    this.loadInfo()
    this.loadLocalization()
  }

  loadInfo = () => {
    this.props.getTableLayouts()
    this.props.getShiftStatus()
    this.props.getMostRecentShiftStatus()
    this.props.getfetchOrderInflights()
    this.props.getAvailableTables()
    this.props.getCurrentClient()
  }

  loadLocalization = () => {
    this.context.localize({
      en: {
        noTableLayout:
          'You need to define at least one table layout and one table.',
        noInflightOrders: 'No order on this table layout',
        shiftClosing: 'Please close shift first',
        openShift: {
          title: 'Open shift to start sales',
          openBalance: 'Open Balance',
          enterAmount: 'Enter Amount',
          open: 'Open',
          cancel: 'Cancel'
        },
        otherOrders: 'Other Orders',
        seatingCapacity: 'Seats',
        tableCapacity: 'Tables',
        availableSeats: 'Vacant',
        availableTables: 'Vacant',
      },
      zh: {
        noTableLayout: '需要創建至少一個桌面跟一個桌位.',
        noInflightOrders: '此樓面沒有訂單',
        shiftClosing: '請先完成關帳',
        openShift: {
          title: '請開帳來開始銷售',
          openBalance: '開帳現金',
          enterAmount: '請輸入金額',
          open: '開帳',
          cancel: '取消'
        },
        otherOrders: '其他訂單',
        seatingCapacity: '總座位',
        tableCapacity: '總桌數',
        availableSeats: '空位',
        availableTables: '空桌',
      }
    })
  }

  onRefresh = async () => {
    this.setState({refreshing: true})

    this.loadInfo()

    this.setState({refreshing: false}, () => {
      successMessage(this.context.t('refreshed'))
    })
  }

  getTransform = () => {
    let transform = {
      transform: [{scale: this.state.scaleMultiple}],
    };
    return withAnchorPoint(transform, {x: 0, y: 0}, {width: 300, height: 300});
  };

  handleOpenShift = (balance) => {
    handleOpenShift(balance, (response) => {
      this.loadInfo()
      this.setState({openBalance: 0})
    })
  }

  render() {
    const {
      navigation,
      haveData,
      client,
      isLoading,
      tablelayouts,
      shiftStatus,
      recentShift,
      ordersInflight,
      availableTables,
      themeStyle
    } = this.props
    const {t} = this.context

    if (isLoading) {
      return (
        <LoadingScreen />
      )
    } else if (tablelayouts === undefined || tablelayouts.length === 0) {
      return (
        <ThemeScrollView
          refreshControl={
            <RefreshControl
              refreshing={this.state.refreshing}
              onRefresh={this.onRefresh}
            />
          }
        >

          <View style={styles.fullWidthScreen}>
            <ScreenHeader backNavigation={false}
              parentFullScreen={true}
              title={t('menu.tables')}
            />
            <StyledText style={styles.messageBlock}>{t('noTableLayout')}</StyledText>
          </View>
        </ThemeScrollView>
      )
    } else if (recentShift !== undefined && ['CLOSING', 'CONFIRM_CLOSE'].includes(recentShift.data.shiftStatus)) {
      return (
        <ThemeContainer>
          <View style={[styles.fullWidthScreen]}>
            <ScreenHeader backNavigation={false}
              parentFullScreen={true}
              title={t('menu.tables')}
            />
            <View>
              <StyledText style={styles.messageBlock}>{t('shiftClosing')}</StyledText>
            </View>
            <View style={[styles.bottom, styles.horizontalMargin]}>
              <TouchableOpacity onPress={() => navigation.navigate('ShiftClose')}>
                <Text style={[styles.bottomActionButton, styles.actionButton]}>
                  {t('shift.closeShift')}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </ThemeContainer>
      )

    } else if (shiftStatus === 'INACTIVE') {
      return (
        <ThemeContainer>
          <View style={styles.modalContainer}>
            <View style={[styles.boxShadow, styles.popUpLayout, themeStyle]}>
              <Text style={styles.screenSubTitle}>
                {t('openShift.title')}
              </Text>
              <View style={styles.tableRowContainer}>
                <View style={[styles.tableCellView, {flex: 1}]}>
                  <StyledText style={[styles.fieldTitle]}>
                    {t('openShift.openBalance')}
                  </StyledText>
                </View>
                <View style={[styles.tableCellView, {flex: 3, justifyContent: 'flex-end'}]}>
                  <StyledTextInput
                    name="balance"
                    type="text"
                    onChangeText={value =>
                      this.setState({openBalance: value})
                    }
                    placeholder={t('openShift.enterAmount')}
                    keyboardType={`numeric`}
                  />
                </View>
              </View>
              <View style={[styles.jc_alignIem_center, styles.flex_dir_row]}>
                <View style={{width: '45%', marginHorizontal: 5}}>
                  <TouchableOpacity onPress={() => this.handleOpenShift(this.state.openBalance)}>
                    <Text style={[styles.bottomActionButton, styles.actionButton]}>
                      {t('openShift.open')}
                    </Text>
                  </TouchableOpacity>
                </View>
                <View style={{width: '45%', marginHorizontal: 5}}>
                  <TouchableOpacity
                    onPress={() => {
                      this.props.navigation.navigate('LoginSuccess')
                    }}
                  >
                    <Text style={[styles.bottomActionButton, styles.cancelButton]}>
                      {t('openShift.cancel')}
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </View>
        </ThemeContainer>
      )
    } else if (haveData) {
      let tableDisplay = 'SHOW_SEAT'

      if (client.attributes !== undefined && client.attributes.TABLE_AVAILABILITY_DISPLAY !== undefined) {
        tableDisplay = client.attributes.TABLE_AVAILABILITY_DISPLAY
      }

      const floorCapacity = {}

      availableTables && tablelayouts && tablelayouts.forEach((layout, idx) => {

        let seatCount = 0
        let tableCount = 0
        const availableTablesOfLayout = availableTables[layout.id]

        availableTablesOfLayout !== undefined && availableTablesOfLayout.forEach((table, idx2) => {
          seatCount += table.capacity
          tableCount += 1
        })

        floorCapacity[layout.id] = {}
        floorCapacity[layout.id].seatCount = seatCount
        floorCapacity[layout.id].tableCount = tableCount
      })

      /*tablet render*/
      if (this?.state?.isTablet) {
        return (
          <ThemeScrollView
            refreshControl={
              <RefreshControl
                refreshing={this.state.refreshing}
                onRefresh={this.onRefresh}
              />
            }
          >
            <NavigationEvents
              onWillFocus={() => {
                this.loadInfo()
                this.loadLocalization()
              }}
            />

            <View style={styles.fullWidthScreen}>
              <ScreenHeader backNavigation={false}
                title={t('menu.tables')}
                parentFullScreen={true}
                rightComponent={
                  <AddBtn
                    onPress={() =>
                      this.props.navigation.navigate('OrderStart')
                    }
                  />
                }
              />



              <NewOrderModal modalVisible={this.state.modalVisible}
                submitOrder={(orderId) => {
                  this.setState({modalVisible: false});
                  this.props.navigation.navigate('OrderFormII', {
                    orderId: orderId
                  })
                }}
                closeModal={() => {this.setState({modalVisible: false})}}
                data={this.state.orderModalData} />
              <View style={[styles.container, {marginTop: 0, justifyContent: 'flex-start', }]}>
                {/* table page button */}
                <View style={{flexDirection: 'row', width: '100%'}}>
                  {tablelayouts?.map((tblLayout, index) => {
                    return (<TouchableOpacity
                      style={{
                        borderColor: this.state.themeStyle.color,
                        borderWidth: 0.5,
                        borderBottomWidth: 0,
                        padding: 4,
                        borderTopLeftRadius: 4,
                        borderTopRightRadius: 4,
                        width: 120,
                        backgroundColor: this.state?.tableIndex === index ? themeStyle.color : null,
                      }}
                      onPress={() => {this.setState({tableIndex: index})}}>
                      <StyledText style={[styles.sectionBarText, {flex: 4, textAlign: 'center', marginRight: 4}]}>
                        {tblLayout.layoutName}
                      </StyledText>
                      {floorCapacity[tblLayout.id] !== undefined && tableDisplay === 'SHOW_SEAT' && (
                        <>
                          <Text style={[styles.sectionBarText, {flex: 4, textAlign: 'center', marginRight: 4}]}>
                            {t('seatingCapacity')} {tblLayout.totalCapacity}
                          </Text>
                          <Text style={[styles.sectionBarText, {flex: 4, textAlign: 'center', marginRight: 4}]}>
                            {t('availableSeats')} {floorCapacity[tblLayout.id].seatCount}
                          </Text>
                        </>
                      )}
                      {floorCapacity[tblLayout.id] !== undefined && tableDisplay === 'SHOW_TABLE' && (
                        <>
                          <Text style={[styles.sectionBarText, {flex: 4, textAlign: 'center', marginRight: 4}]}>
                            {t('tableCapacity')} {tblLayout.totalTables}
                          </Text>
                          <Text style={[styles.sectionBarText, {flex: 4, textAlign: 'center', marginRight: 4}]}>
                            {t('availableTables')} {floorCapacity[tblLayout.id].tableCount}
                          </Text>
                        </>
                      )}

                    </TouchableOpacity>)
                  })}
                  <View style={{flex: 1, }}>
                    <TouchableOpacity
                      style={{
                        borderColor: this.state.themeStyle.color,
                        borderWidth: 0.5,
                        borderBottomWidth: 0,
                        padding: 4,
                        borderTopLeftRadius: 4,
                        borderTopRightRadius: 4,
                        width: 120,
                        alignSelf: 'flex-end',
                        flex: 1,
                        alignItems: 'center',
                        justifyContent: 'center',
                        backgroundColor: this.state?.tableIndex === -1 ? themeStyle.color : null,
                      }}
                      onPress={() => {this.setState({tableIndex: -1})}}>
                      <Text style={[styles.sectionBarText]}>
                        {t('otherOrders')}
                      </Text>
                    </TouchableOpacity>
                  </View>

                </View>
                {/* table */}
                {this.state.tableIndex >= 0 &&
                  <View style={{flex: 1}}>
                    <View onLayout={(event) => {
                      let {x, y, width, height} = event.nativeEvent.layout;
                      this.setState({
                        tableWidth: width,
                        tableHeight: height,
                      })
                    }} style={[styles.ballContainer, {height: '100%', }]}>
                      <View style={{justifyContent: 'center', alignItems: 'center', position: 'absolute', top: 0, left: 0, flexDirection: 'row'}}>
                        <View style={{backgroundColor: mainThemeColor, height: 12, width: 12, margin: 6}}></View>
                        <StyledText>{t('orderState.OTHERS')}</StyledText>
                        <View style={{backgroundColor: '#b58cff', height: 12, width: 12, margin: 6}}></View>
                        <StyledText>{t('orderState.OPEN')}</StyledText>
                        <View style={{backgroundColor: '#8ccdff', height: 12, width: 12, margin: 6}}></View>
                        <StyledText>{t('orderState.IN_PROCESS')}</StyledText>
                        <View style={{backgroundColor: '#ff8cf6', height: 12, width: 12, margin: 6}}></View>
                        <StyledText>{t('orderState.DELIVERED')}</StyledText>
                        <View style={{backgroundColor: '#32cd32', height: 12, width: 12, margin: 6}}></View>
                        <StyledText>{t('orderState.SETTLED')}</StyledText>

                      </View>

                      {
                        tablelayouts[this.state.tableIndex]?.tables?.map(table => {
                          return (this.state?.tableWidth && <Draggable
                            table={table}
                            key={table.tableId}
                            layoutId={1}
                            getTableLayout={this.props.getTableLayout}
                            tableWidth={this.state?.tableWidth ?? this.state?.windowWidth}
                            tableHeight={this.state?.tableHeight ?? this.state?.windowHeight}
                            orders={ordersInflight}
                            openOrderModal={(item) => {
                              console.log("item", item)
                              this.setState({
                                modalVisible: true,
                                orderModalData: item
                              })
                            }}
                            gotoOrderDetail={(order) => {
                              console.log("gotoOrderDetail", order);
                              navigation.navigate('OrderFormII', {
                                orderId: order.orderId,
                                orderState: order.state
                              })
                            }}
                          />)
                        })
                      }
                    </View>
                  </View>}
                {this.state.tableIndex === -1 &&
                  <View style={styles.mgrbtn20} key='noLayout'>
                    <View style={[styles.sectionBar, {flex: 1, justifyContent: 'flex-start', paddingVertical: 0, }]}>

                    </View>
                    <FlatList
                      data={ordersInflight['NO_LAYOUT']}
                      renderItem={({item}) => {
                        return (
                          <OrderItem
                            order={item}
                            navigation={navigation}
                            handleOrderSubmit={handleOrderSubmit}
                            handleDelete={handleDelete}
                            key={item.orderId}
                          />
                        )
                      }}
                      ListEmptyComponent={
                        <View>
                          <StyledText style={styles.messageBlock}>{t('noInflightOrders')}</StyledText>
                        </View>
                      }
                      keyExtractor={(item, idx) => item.orderId}
                    />
                  </View>
                }
              </View>

              <View style={styles.bottomButtonContainerWithoutFlex}>
                <TouchableOpacity onPress={() => navigation.navigate('OrderDisplayScreen')}>
                  <Text style={[styles.bottomActionButton, styles.actionButton]}>
                    {t('menu.orderDisplay')}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </ThemeScrollView >
        )
      }
      /*phone render */
      else {
        return (
          <ThemeScrollView
            refreshControl={
              <RefreshControl
                refreshing={this.state.refreshing}
                onRefresh={this.onRefresh}
              />
            }
          >
            <NavigationEvents
              onWillFocus={() => {
                this.loadInfo()
                this.loadLocalization()
              }}
            />

            <View style={styles.fullWidthScreen}>
              <ScreenHeader backNavigation={false}
                title={t('menu.tables')}
                parentFullScreen={true}
                rightComponent={
                  <AddBtn
                    onPress={() =>
                      this.props.navigation.navigate('OrderStart')
                    }
                  />
                }
              />

              {tablelayouts.map((tblLayout, idx) => (
                <View style={{}} key={idx}>
                  <View style={[styles.sectionBar, {flex: 1}]}>
                    <Text
                      style={[styles.sectionBarText, {flex: 4}
                      ]}
                    >
                      {tblLayout.layoutName}
                    </Text>
                    {floorCapacity[tblLayout.id] !== undefined && tableDisplay === 'SHOW_SEAT' && (
                      <Text style={[styles.sectionBarText, {flex: 4, textAlign: 'right', marginRight: 4}]}>
                        {t('seatingCapacity')} {tblLayout.totalCapacity} {t('availableSeats')} {floorCapacity[tblLayout.id].seatCount}
                      </Text>
                    )}
                    {floorCapacity[tblLayout.id] !== undefined && tableDisplay === 'SHOW_TABLE' && (
                      <Text style={[styles.sectionBarText, {flex: 4, textAlign: 'right', marginRight: 4}]}>
                        {t('tableCapacity')} {tblLayout.totalTables} {t('availableTables')} {floorCapacity[tblLayout.id].tableCount}
                      </Text>
                    )}
                  </View>
                  <FlatList
                    data={ordersInflight[tblLayout.id]}
                    renderItem={({item}) => {
                      return (
                        <OrderItem
                          order={item}
                          navigation={navigation}
                          handleOrderSubmit={handleOrderSubmit}
                          handleDelete={handleDelete}
                          key={item.orderId}
                        />
                      )
                    }}
                    ListEmptyComponent={
                      <View>
                        <StyledText style={styles.messageBlock}>{t('noInflightOrders')}</StyledText>
                      </View>
                    }
                    keyExtractor={(item, idx) => item.orderId}
                  />
                </View>
              ))}
              <View style={styles.mgrbtn20} key='noLayout'>
                <View style={[styles.sectionBar, {flex: 1, justifyContent: 'flex-start'}]}>
                  <Text style={[styles.sectionBarText]}>
                    {t('otherOrders')}
                  </Text>
                </View>
                <FlatList
                  data={ordersInflight['NO_LAYOUT']}
                  renderItem={({item}) => {
                    return (
                      <OrderItem
                        order={item}
                        navigation={navigation}
                        handleOrderSubmit={handleOrderSubmit}
                        handleDelete={handleDelete}
                        key={item.orderId}
                      />
                    )
                  }}
                  ListEmptyComponent={
                    <View>
                      <StyledText style={styles.messageBlock}>{t('noInflightOrders')}</StyledText>
                    </View>
                  }
                  keyExtractor={(item, idx) => item.orderId}
                />
              </View>

              <View style={[styles.bottom, styles.horizontalMargin]}>
                <TouchableOpacity onPress={() => navigation.navigate('OrderDisplayScreen')}>
                  <Text style={[styles.bottomActionButton, styles.actionButton]}>
                    {t('menu.orderDisplay')}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </ThemeScrollView>
        )
      }

    } else {
      return null
    }
  }
}

const mapStateToProps = state => ({
  tablelayouts: state.tablelayouts.data.tableLayouts,
  ordersInflight: state.ordersinflight.data.orders,
  haveData: state.ordersinflight.haveData && state.tablelayouts.haveData,
  haveError: state.ordersinflight.haveError || state.tablelayouts.haveError,
  isLoading: state.ordersinflight.loading || state.tablelayouts.loading,
  shiftStatus: state.shift.data.shiftStatus,
  availableTables: state.tablesavailable.data.availableTables,
  client: state.client.data,
  recentShift: {
    loading: state.mostRecentShift.loading,
    haveData: state.mostRecentShift.haveData,
    data: state.mostRecentShift.data,
  }
})

const mapDispatchToProps = (dispatch, props) => ({
  dispatch,
  getfetchOrderInflights: () => dispatch(getfetchOrderInflights()),
  getTableLayouts: () => dispatch(getTableLayouts()),
  getShiftStatus: () => dispatch(getShiftStatus()),
  getMostRecentShiftStatus: () => dispatch(getMostRecentShiftStatus()),
  getAvailableTables: () => dispatch(getTablesAvailable()),
  getCurrentClient: () => dispatch(getCurrentClient())
})

const enhance = compose(
  connect(mapStateToProps, mapDispatchToProps),
  withContext
)
export default enhance(TablesScreen)

class Draggable extends Component {
  constructor(props) {
    super(props);
    console.log(JSON.stringify(props));
    this.state = {
      dropAreaValues: null,
      pan: new Animated.ValueXY(),
      opacity: new Animated.Value(1)
    };
  }

  componentDidMount() {
    const windowWidth = this.props.tableWidth;
    const windowHeight = this.props.tableHeight;
    if (this.props.table.position != null) {
      this.state.pan.setValue({x: Number(this.props.table.position.x * windowWidth), y: Number(this.props.table.position.y * windowHeight)})
    } else {
      this.state.pan.setValue({x: 0, y: 0})
    }
  }

  UNSAFE_componentWillMount() {
    this.panResponder = PanResponder.create({
      onStartShouldSetPanResponder: (evt, gestureState) => true,
      onPanResponderGrant: (e, gesture) => {
        this.state.pan.setOffset({
          x: this.state.pan.x._value,
          y: this.state.pan.y._value
        })
        //this.state.pan.setValue({ x:0, y:0})
      },
      onPanResponderMove: Animated.event([
        null, {dx: this.state.pan.x, dy: this.state.pan.y}
      ]),
      onPanResponderRelease: (e, gesture) => {
        this.state.pan.flattenOffset();
        console.log(`on release: ${JSON.stringify(this.state.pan)}`)


        Animated.timing(this.state.opacity, {
          toValue: 0,
          duration: 1000
        }).start();

      }
    });
  }

  renderDraggable(layoutId, table, orders, openOrderModal) {
    TimeAgo.addLocale(en)
    const timeAgo = new TimeAgo()

    const panStyle = {
      transform: this.state.pan.getTranslateTransform()
    }
    return (
      <View style={{padding: 4}}>
        {
          table.position !== null
            ?
            <View>
              <View key={table.tableId}>
                <StyledText style={{
                  textAlign: 'center',
                  padding: 4,
                  fontSize: 12,
                  borderRadius: 4,
                  width: 60,
                  color: 'rgba(0,0,0,0)'
                }}>Reset-{table.tableName}
                </StyledText>
              </View>

              <TouchableOpacity
                onPress={() => {
                  if (!!this.props?.orders[`${table.tableId?.slice(0, -2)}`]?.find((item) => {return item?.tableName === table.tableName})?.state) {
                    this.props?.gotoOrderDetail({
                      orderId: this.props?.orders[`${table.tableId?.slice(0, -2)}`]?.find((item) => {return item?.tableName === table.tableName})?.orderId,
                      state: this.props?.orders[`${table.tableId?.slice(0, -2)}`]?.find((item) => {return item?.tableName === table.tableName})?.state
                    })
                  } else {
                    openOrderModal({
                      table: table,
                      order: orders
                    });
                  }

                  console.log(table, JSON.stringify(this.props?.orders[`${table.tableId?.slice(0, -2)}`]?.find((item) => {return item?.tableName === table.tableName})))
                }}
                style={[panStyle, styles.circle, {position: 'absolute', alignItems: 'center', justifyContent: 'space-around'}, (!!this.props?.orders[`${table.tableId?.slice(0, -2)}`]?.find((item) => {return item?.tableName === table.tableName})?.state &&
                {
                  backgroundColor: this.props?.orders[`${table.tableId?.slice(0, -2)}`]?.find((item) => {return item?.tableName === table.tableName})?.state == 'OPEN' ? '#b58cff'
                    : this.props?.orders[`${table.tableId?.slice(0, -2)}`]?.find((item) => {return item?.tableName === table.tableName})?.state == 'IN_PROCESS' ? '#8ccdff'
                      : this.props?.orders[`${table.tableId?.slice(0, -2)}`]?.find((item) => {return item?.tableName === table.tableName})?.state == 'DELIVERED' ? '#ff8cf6'
                        : '#32cd32'
                })]}>
                <Text style={{color: '#fff', textAlign: 'center', }}>{table.tableName}</Text>
                <Text style={{color: '#fff', textAlign: 'center', }}>{`${this.props?.orders[`${table.tableId?.slice(0, -2)}`]?.find((item) => {return item?.tableName === table.tableName})?.customerCount ?? 0}/${table.capacity}`}</Text>
                {!!this.props?.orders[`${table.tableId?.slice(0, -2)}`]?.find((item) => {return item?.tableName === table.tableName})?.createdTime &&
                  <View style={[styles.tableCellView, {justifyContent: 'center'}]}>
                    <FontAwesomeIcon name={'clock-o'} color={getTimeDifference(this.props?.orders[`${table.tableId?.slice(0, -2)}`]?.find((item) => {return item?.tableName === table.tableName})?.createdTime) < 30 * 60 * 1000 ? mainThemeColor : 'red'} size={20} />
                    <StyledText style={{marginLeft: 2}}>
                      {timeAgo.format(Date.now() - getTimeDifference(this.props?.orders[`${table.tableId?.slice(0, -2)}`]?.find((item) => {return item?.tableName === table.tableName})?.createdTime), 'time')}
                    </StyledText>
                  </View>}
              </TouchableOpacity>

            </View>
            :
            <View style={{marginTop: 46}}>
              <View key={table.tableId}>
                <StyledText style={{
                  textAlign: 'center',
                  padding: 4,
                  fontSize: 12,
                  borderRadius: 4,
                  width: 60,
                  color: 'rgba(0,0,0,0)'
                }}>Reset-{table.tableName}
                </StyledText>
              </View>

              <TouchableOpacity
                onPress={() => {
                  if (!!this.props?.orders[`${table.tableId?.slice(0, -2)}`]?.find((item) => {return item?.tableName === table.tableName})?.state) {
                    this.props?.gotoOrderDetail({
                      orderId: this.props?.orders[`${table.tableId?.slice(0, -2)}`]?.find((item) => {return item?.tableName === table.tableName})?.orderId,
                      state: this.props?.orders[`${table.tableId?.slice(0, -2)}`]?.find((item) => {return item?.tableName === table.tableName})?.state
                    })
                  } else {
                    openOrderModal({
                      table: table,
                      order: orders
                    });
                  }

                  console.log(table, JSON.stringify(this.props?.orders[`${table.tableId?.slice(0, -2)}`]?.find((item) => {return item?.tableName === table.tableName})))
                }}
                style={[panStyle, styles.circle, {position: 'absolute', alignItems: 'center', justifyContent: 'space-around'}, (!!this.props?.orders[`${table.tableId?.slice(0, -2)}`]?.find((item) => {return item?.tableName === table.tableName})?.state &&
                {
                  backgroundColor: this.props?.orders[`${table.tableId?.slice(0, -2)}`]?.find((item) => {return item?.tableName === table.tableName})?.state == 'OPEN' ? '#b58cff'
                    : this.props?.orders[`${table.tableId?.slice(0, -2)}`]?.find((item) => {return item?.tableName === table.tableName})?.state == 'IN_PROCESS' ? '#8ccdff'
                      : this.props?.orders[`${table.tableId?.slice(0, -2)}`]?.find((item) => {return item?.tableName === table.tableName})?.state == 'DELIVERED' ? '#ff8cf6'
                        : '#32cd32'
                })]}>
                <Text style={{color: '#fff', textAlign: 'center', }}>{table.tableName}</Text>
                <Text style={{color: '#fff', textAlign: 'center', }}>{`${this.props?.orders[`${table.tableId?.slice(0, -2)}`]?.find((item) => {return item?.tableName === table.tableName})?.customerCount ?? 0}/${table.capacity}`}</Text>
                {!!this.props?.orders[`${table.tableId?.slice(0, -2)}`]?.find((item) => {return item?.tableName === table.tableName})?.createdTime &&
                  <View style={[styles.tableCellView, {justifyContent: 'center'}]}>
                    <FontAwesomeIcon name={'clock-o'} color={getTimeDifference(this.props?.orders[`${table.tableId?.slice(0, -2)}`]?.find((item) => {return item?.tableName === table.tableName})?.createdTime) < 30 * 60 * 1000 ? mainThemeColor : 'red'} size={20} />
                    <StyledText style={{marginLeft: 2}}>
                      {timeAgo.format(Date.now() - getTimeDifference(this.props?.orders[`${table.tableId?.slice(0, -2)}`]?.find((item) => {return item?.tableName === table.tableName})?.createdTime), 'time')}
                    </StyledText>
                  </View>}
              </TouchableOpacity>

            </View>
        }
      </View>
    );
  }

  render() {
    const {table, layoutId, orders, openOrderModal} = this.props
    return (
      <View style={{alignItems: "flex-start", borderWidth: 0, marginBottom: 0}} ref='self'>
        {this.renderDraggable(layoutId, table, orders, openOrderModal)}
      </View>
    );
  }
}

//https://snack.expo.io/@yoobidev/draggable-component