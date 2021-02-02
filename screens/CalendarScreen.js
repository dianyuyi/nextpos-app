import React from 'react'
import {View, Text, ScrollView, TouchableOpacity, Alert} from 'react-native'
import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome'
import MCIcon from 'react-native-vector-icons/MaterialCommunityIcons'
import styles, {mainThemeColor} from '../styles'
import {LocaleContext} from '../locales/LocaleContext'
import ScreenHeader from "../components/ScreenHeader";
import MenuButton from "../components/MenuButton";
import {withContext} from "../helpers/contextHelper";
import {ThemeScrollView} from "../components/ThemeScrollView";
import {ThemeContainer} from "../components/ThemeContainer";
import {Calendar, LocaleConfig} from 'react-native-calendars';
import {api, dispatchFetchRequest} from '../constants/Backend'
import {NavigationEvents} from 'react-navigation'
import TimeZoneService from "../helpers/TimeZoneService";
import moment from "moment-timezone";
import {StyledText} from '../components/StyledText'
import {RenderAgenda, DayCalendar} from "../components/Calendars";
import UserSelectModal from './UserSelectModal';
import AddBtn from '../components/AddBtn'
import Modal from 'react-native-modal';
import {OptionModal} from "../components/OptionModal";
import {MainActionButton} from '../components/ActionButtons'
import SegmentedControlTab from "react-native-segmented-control-tab";
import {CheckBox} from 'react-native-elements'
import Icon from 'react-native-vector-icons/Ionicons'
import {CalendarEvent} from "../components/CalendarEvent";
import {Ionicons} from '@expo/vector-icons';
import {compose} from "redux";
import {connect} from 'react-redux'

class CalendarScreen extends React.Component {
    static navigationOptions = {
        header: null
    }
    static contextType = LocaleContext

    constructor(props, context) {
        super(props, context)
        const timezone = TimeZoneService.getTimeZone()
        this.state = {
            isLoading: true,
            rosterPlansData: [],
            calendarMode: 'month',
            selectedDate: moment(new Date()).tz(timezone).format("YYYY-MM-DD"),

            users: [],
            showRosterFormModal: false,
            isShowModal: false,
            calendarTypeIndex: 0,
            searchTypeIndex: 0,
            isOnlyMyEvent: false,
            modalTasks: [],
            nowYear: new Date().getFullYear(),
            nowMonth: new Date().getMonth() + 1,
            monthLoading: false
        }
        context.localize({
            en: {
                calendar: {
                    monthly: 'Monthly',
                    weekly: 'Weekly',
                    daily: 'Daily',
                    roster: 'Roster',
                    reservation: 'Reservation',
                    showMyEvent: 'Show my event.',
                }
            },
            zh: {
                calendar: {
                    monthly: '月曆',
                    weekly: '周歷',
                    daily: '日曆',
                    roster: '排班',
                    reservation: '訂位',
                    showMyEvent: '顯示我的排班',
                }
            }
        })
        LocaleConfig.locales['zh-Hant-TW'] = {
            monthNames: ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12'],
            monthNamesShort: ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12'],
            dayNames: ['週日', '週一', '週二', '週三', '週四', '週五', '週六'],
            dayNamesShort: ['週日', '週一', '週二', '週三', '週四', '週五', '週六'],
            today: '今日'
        }
        if (this.context?.locale === 'zh-Hant-TW' || this.context?.locale === 'zh-TW')
            LocaleConfig.defaultLocale = 'zh-Hant-TW'
    }

    componentDidMount() {


        this.getUsers()
        this.getEvents()
    }

    refreshScreen = async () => {

        this.getUsers()
        this.getEvents(new Date(this.state?.selectedDate ?? new Date()).getFullYear(), new Date(this.state?.selectedDate ?? new Date()).getMonth() + 1)
    }

    getEvents = async (year = new Date().getFullYear(), month = new Date().getMonth() + 1) => {
        this.setState({isLoading: true})

        await dispatchFetchRequest(api.rosterEvent.getEventsByDate(year, month), {
            method: 'GET',
            withCredentials: true,
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json'
            },
        }, response => {
            response.json().then(async (data) => {
                this.setState({rosterEvents: data?.results, groupedResults: data?.groupedResults})
                this.setState({isLoading: false})
            })
        }).then().catch(() => this.setState({isLoading: false}))
    }



    handleChangeCalendarMode = (date = null, modeIndex = 1) => {
        this.refreshScreen()
        this.setState({calendarMode: ['month', 'week', 'day']?.[modeIndex], calendarTypeIndex: modeIndex})
    }


    getUsers = async () => {

        this.setState({isLoading: true})

        await dispatchFetchRequest(api.clientUser.getAll, {
            method: 'GET',
            withCredentials: true,
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json'
            },
        }, response => {
            response.json().then(async (data) => {
                this.setState({users: data?.users})

            })
        }).then().catch(() => this.setState({isLoading: false}))

    }

    toggleRosterFormModal = (task, flag) => {
        this.setState({showRosterFormModal: flag, modalTasks: task})
    }

    handleMonthChange = async (year = new Date().getFullYear(), month = new Date().getMonth() + 1, callack) => {
        this.setState({monthLoading: true})
        await dispatchFetchRequest(api.rosterEvent.getEventsByDate(year, month), {
            method: 'GET',
            withCredentials: true,
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json'
            },
        }, response => {
            response.json().then(async (data) => {
                this.setState({rosterEvents: data?.results, groupedResults: data?.groupedResults, isLoading: false, nowYear: year, nowMonth: month, monthLoading: false}, () => callack())
            })
        }).then().catch(() => this.setState({monthLoading: true}))
    }



    render() {
        const {themeStyle, handleSubmit} = this.props
        const {t, isTablet} = this.context
        const timezone = TimeZoneService.getTimeZone()



        return (
            <ThemeContainer>
                <NavigationEvents
                    onWillFocus={() => {
                        //this.refreshScreen()
                    }}
                />

                <View style={styles.fullWidthScreen}>
                    <ScreenHeader backNavigation={false}
                        parentFullScreen={true}
                        title={t('calendarEvent.screenTitle')}
                        rightComponent={
                            <View style={{flexDirection: 'row'}}>
                                <View style={{marginRight: 8}}>
                                    <OptionModal
                                        icon={<Icon name="filter" size={32} color={mainThemeColor} />}
                                        toggleModal={(flag) => this.setState({isShowModal: flag})}
                                        isShowModal={this.state?.isShowModal}>
                                        <View style={{maxWidth: 640}}>
                                            <View style={[styles.tableRowContainer]}>
                                                <TouchableOpacity
                                                    onPress={() => {
                                                        this.setState({searchTypeIndex: 0})
                                                    }}
                                                    style={[{flex: 1, borderWidth: 1, borderColor: mainThemeColor, borderRadius: 10, alignItems: 'center', justifyContent: 'center', paddingVertical: 10, marginRight: 5}, (this.state?.searchTypeIndex === 0 && {backgroundColor: mainThemeColor})]}>
                                                    <StyledText>{t('calendar.roster')}</StyledText>
                                                </TouchableOpacity>
                                                <TouchableOpacity
                                                    onPress={() => {
                                                        this.setState({searchTypeIndex: 1})
                                                    }}
                                                    style={[{flex: 1, borderWidth: 1, borderColor: mainThemeColor, borderRadius: 10, alignItems: 'center', justifyContent: 'center', paddingVertical: 10, marginLeft: 5}, (this.state?.searchTypeIndex === 1 && {backgroundColor: mainThemeColor})]}>
                                                    <StyledText>{t('calendar.reservation')}</StyledText>
                                                </TouchableOpacity>

                                            </View>
                                            {this.state?.searchTypeIndex === 0 && <View style={{
                                                flexDirection: 'row',
                                                paddingVertical: 8,
                                                alignItems: 'center'
                                            }}>
                                                <View>
                                                    <CheckBox
                                                        checkedIcon={'check-circle'}
                                                        uncheckedIcon={'circle'}
                                                        checked={this.state?.isOnlyMyEvent}
                                                        containerStyle={{margin: 0, padding: 0, minWidth: 0}}
                                                        onPress={() => {
                                                            this.setState({isOnlyMyEvent: !this.state?.isOnlyMyEvent})
                                                        }}
                                                    >
                                                    </CheckBox>
                                                </View>
                                                <StyledText>{t('calendar.showMyEvent')}</StyledText>
                                            </View>}
                                            <View style={[styles.tableRowContainer]}>
                                                <SegmentedControlTab
                                                    values={[t('calendar.monthly'), t('calendar.weekly'), t('calendar.daily')]}
                                                    selectedIndex={this.state?.calendarTypeIndex}
                                                    onTabPress={(index) => {
                                                        this.handleChangeCalendarMode(null, index)
                                                    }}
                                                    {...{
                                                        tabsContainerStyle: {width: '100%'},
                                                        tabStyle: {borderColor: mainThemeColor, width: '100%', backgroundColor: themeStyle.backgroundColor},
                                                        tabTextStyle: {color: mainThemeColor},
                                                        activeTabStyle: {backgroundColor: mainThemeColor}
                                                    }}
                                                />
                                            </View>

                                        </View>
                                    </OptionModal>
                                </View>
                                {this.props?.currentUser?.roles?.includes('MANAGER') && <TouchableOpacity
                                    onPress={() => this.props?.navigation.navigate('RostersFormScreen',
                                        {data: null, users: this.state?.users, refreshScreen: () => this.refreshScreen(), isManager: this.props?.currentUser?.roles?.includes('MANAGER')})}
                                >
                                    <View>
                                        <Icon name="add" size={32} color={mainThemeColor} />
                                    </View>
                                </TouchableOpacity>}

                            </View>
                        }
                    />
                    <Modal
                        isVisible={this.state?.showRosterFormModal}
                        useNativeDriver
                        hideModalContentWhileAnimating
                        animationIn='fadeInDown'
                        animationOut='fadeOutUp'
                        onBackdropPress={() => this.toggleRosterFormModal([], false)}
                        style={{
                            margin: 0
                        }}
                    >

                        <ScrollView style={[themeStyle, {maxWidth: 640, alignSelf: 'center', marginVertical: '15%', width: '100%', flex: 1}]}>

                            {this.state?.modalTasks?.map((task) => {
                                return (
                                    <CalendarEvent event={task} isManager={this.props?.currentUser?.roles?.includes('MANAGER')}
                                        users={this.state?.users} closeModal={() => this.toggleRosterFormModal([], false)} refreshScreen={() => this.refreshScreen()} />
                                )
                            })}
                        </ScrollView>


                    </Modal>



                    {this.state.isLoading || this.state.calendarMode === 'month' && <View style={[styles.flex(1)]}>

                        <Calendar
                            current={this.state?.selectedDate}

                            onDayPress={(day) => {console.log('selected day', day)}}
                            onDayLongPress={(day) => {console.log('selected day', day)}}
                            monthFormat={'yyyy MM'}
                            hideExtraDays={false}
                            disableMonthChange={true}
                            firstDay={1}
                            hideDayNames={false}
                            showWeekNumbers={false}
                            onPressArrowLeft={subtractMonth => {
                                this.handleMonthChange(
                                    this.state?.nowMonth === 1 ? this.state?.nowYear - 1 :
                                        this.state?.nowYear,
                                    this.state?.nowMonth === 1 ? 12 : this.state?.nowMonth - 1, () => subtractMonth())
                            }}
                            onPressArrowRight={addMonth => {
                                this.handleMonthChange(
                                    this.state?.nowMonth === 12 ? this.state?.nowYear + 1 :
                                        this.state?.nowYear,
                                    this.state?.nowMonth === 12 ? 1 : this.state?.nowMonth + 1, () => addMonth())
                            }}
                            disableArrowLeft={this.state?.monthLoading}
                            disableArrowRight={this.state?.monthLoading}
                            disableAllTouchEventsForDisabledDays={true}
                            enableSwipeMonths={false}
                            style={{
                                height: '100%',
                            }}
                            theme={{
                                'stylesheet.calendar.main': {
                                    week: {
                                        flexDirection: 'row',
                                        flex: 1,
                                        height: 1
                                    },
                                    monthView: {
                                        flex: 1,
                                        marginHorizontal: -5
                                    },
                                    dayContainer: {
                                        flex: 1,
                                        alignItems: 'center',
                                        borderColor: 'gray',
                                        borderWidth: 0.5
                                    },
                                }
                            }}
                            dayComponent={({date, state, onPress}) => {
                                let today = moment(new Date()).tz(timezone).format("YYYY-MM-DD")
                                let isToday = today === date.dateString
                                let task = !!this.state?.rosterEvents
                                    ? this.state?.rosterEvents?.filter((event) => {
                                        return moment(event?.startTime ?? new Date()).tz(timezone).format("YYYY-MM-DD") === date.dateString
                                    })
                                    : []
                                return (
                                    <TouchableOpacity
                                        style={{flex: 1, width: '100%'}}
                                        onPress={() => {
                                            this.setState({selectedDate: date?.dateString})
                                            task?.length > 0 && this.toggleRosterFormModal(task, true)
                                        }}
                                    >
                                        <View style={{flex: 1}}>
                                            <View style={{flex: 1, justifyContent: 'center'}}>
                                                <Text style={{
                                                    textAlign: 'center',
                                                    color: isToday ? '#00adf5' : state === 'disabled' ? 'rgba(128, 128, 128, 0.5)' : 'black',
                                                }}>
                                                    {date.day}
                                                </Text>
                                            </View>
                                            <View style={{flex: 2}}>
                                                <ScrollView style={{flex: 1}}>
                                                    {task?.map((event) => {
                                                        const i18nMomentFrom = moment(event?.startTime ?? new Date()).tz(timezone).format("HH:mm");
                                                        const phoneI18nMomentFrom = moment(event?.startTime ?? new Date()).tz(timezone).format("HH");
                                                        let resourcesCount = 0
                                                        for (const [key, value] of Object.entries(event?.eventResources)) {
                                                            if (Array.isArray(value)) {
                                                                resourcesCount += value?.length
                                                            }
                                                        }
                                                        return (isTablet ?
                                                            <TouchableOpacity
                                                                onPress={() => {
                                                                    this.setState({selectedDate: date?.dateString})
                                                                    task?.length > 0 && this.toggleRosterFormModal(task, true)
                                                                }}
                                                                style={{borderWidth: 1, borderColor: (!event?.eventColor || event?.eventColor === '#fff') ? mainThemeColor : event?.eventColor, backgroundColor: event?.eventColor ?? undefined, margin: 5, marginTop: 0, borderRadius: 5}}>
                                                                <Text style={{
                                                                    textAlign: 'center',
                                                                    color: state === 'disabled' ? 'gray' : 'black',
                                                                }}
                                                                    numberOfLines={1}
                                                                >
                                                                    {event?.eventRepeat === 'WEEKLY' && <Ionicons name="copy" color={mainThemeColor} />} {event?.eventName?.slice(0, 2)} {i18nMomentFrom} ({resourcesCount})
                                                                </Text>
                                                            </TouchableOpacity> :
                                                            <TouchableOpacity
                                                                onPress={() => {
                                                                    this.setState({selectedDate: date?.dateString})
                                                                    task?.length > 0 && this.toggleRosterFormModal(task, true)
                                                                }}
                                                                style={{borderWidth: 1, borderColor: (!event?.eventColor || event?.eventColor === '#fff') ? mainThemeColor : event?.eventColor, backgroundColor: event?.eventColor ?? undefined, marginBottom: 5, borderRadius: 5}}>
                                                                <Text style={{
                                                                    textAlign: 'center',
                                                                    color: state === 'disabled' ? 'gray' : 'black',
                                                                }}
                                                                    numberOfLines={1}
                                                                >
                                                                    {event?.eventName?.slice(0, 1)} {phoneI18nMomentFrom}
                                                                </Text>
                                                            </TouchableOpacity>
                                                        )
                                                    })}
                                                </ScrollView>
                                            </View>
                                        </View>
                                    </TouchableOpacity>
                                );
                            }}

                        />

                    </View>}

                    {this.state.isLoading || this.state.calendarMode === 'week' && <View style={[styles.flex(1),]}>

                        <RenderAgenda events={this.state?.rosterEvents} selectedDate={this.state?.selectedDate} isManager={this.props?.currentUser?.roles?.includes('MANAGER')} users={this.state?.users} refreshScreen={() => this.refreshScreen()} />
                    </View>}
                    {this.state.isLoading || this.state.calendarMode === 'day' && <View style={[styles.flex(1),]}>

                        <DayCalendar events={this.state?.groupedResults} selectedDate={this.state?.selectedDate} isManager={this.props?.currentUser?.roles?.includes('MANAGER')} users={this.state?.users} refreshScreen={() => this.refreshScreen()} />
                    </View>}
                </View>
            </ThemeContainer>
        )
    }
}

const mapStateToProps = state => ({
    currentUser: state.clientuser.data,
})


const enhance = compose(
    connect(mapStateToProps, null),
    withContext
)

export default enhance(CalendarScreen)
