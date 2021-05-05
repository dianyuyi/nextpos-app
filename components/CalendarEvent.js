import React, {useState, useContext, useEffect} from 'react';
import {Text, TouchableOpacity, View, StyleSheet} from 'react-native'
import {StyledText} from "./StyledText";
import {LocaleContext} from '../locales/LocaleContext'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import styles from '../styles'
import {Button} from 'react-native-elements';
import {api, dispatchFetchRequest} from '../constants/Backend'
import FontAwesome5Icon from 'react-native-vector-icons/FontAwesome5'
import TimeZoneService from "../helpers/TimeZoneService";
import moment from "moment-timezone";
import {MainActionFlexButton, DeleteFlexButton} from "../components/ActionButtons";
import {withNavigation} from 'react-navigation';

/*
   Date   : 2020-12-03
   Author : GGGODLIN
   Content: props
            event={{}}
            theme={{
                text:{}
            }}

            
*/
const CalendarEventBase = (props) => {
    const localeContext = useContext(LocaleContext);
    const {customMainThemeColor} = localeContext
    const timezone = TimeZoneService.getTimeZone()

    const [event, setEvent] = useState(props?.event ?? null);
    const [modalVisible, setModalVisible] = useState(false);
    const [labels, setLabels] = useState([])

    useEffect(() => {
        setEvent(props?.event ?? null)
    }, [props?.event])

    useEffect(() => {
        dispatchFetchRequest(`${api.workingarea.getAll}?visibility=ROSTER`, {
            method: 'GET',
            withCredentials: true,
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json'
            },
        }, response => {
            response.json().then(data => {
                setLabels(data?.workingAreas)
            })
        }).then()
    }, []);




    const handleAssignUsers = (request) => {
        dispatchFetchRequest(api.rosterEvent.updateEventResources(event?.id), {
            method: 'POST',
            withCredentials: true,
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(request)
        }, response => {
            response.json().then(data => {
                !!props?.refreshScreen && props?.refreshScreen()
                setEvent(data)
            })
        }).then()
    }



    return (
        <TouchableOpacity key={event?.id} style={{flexDirection: 'row', borderWidth: 1, borderRadius: 10, borderColor: event?.eventColor === '#fff' ? customMainThemeColor : event?.eventColor, margin: 10, maxWidth: 640, alignSelf: 'center', padding: 10}}
            onPress={() => {
                !!props?.closeModal && props?.closeModal()
                props.navigation.navigate('RostersFormScreen', {
                    users: props?.users,
                    data: event,
                    refreshScreen: () => {props?.refreshScreen()},
                    isManager: props?.isManager
                })
            }}
        >

            <View style={{flexDirection: 'column', alignItems: 'center', justifyContent: 'center', flex: 1}}>
                <FontAwesome5Icon
                    name={event?.eventType === 'ROSTER' ? "business-time" : 'utensils'}
                    size={36}
                    style={[styles?.buttonIconStyle(customMainThemeColor), {color: event?.eventColor === '#fff' ? customMainThemeColor : event?.eventColor}]}
                />
                <StyledText style={{...props?.theme?.text, marginTop: 10}}>{event?.eventName}</StyledText>

            </View>
            <View style={{flexDirection: 'column', justifyContent: 'space-between', flex: 3}}>
                <View style={{flexDirection: 'row', justifyContent: 'center'}}>

                    <StyledText style={{flexWrap: 'wrap', fontSize: 16, marginBottom: 16}}>{moment(event?.startTime ?? new Date()).tz(timezone).format("HH:mm")} - {moment(event?.endTime ?? new Date()).tz(timezone).format("HH:mm")}</StyledText>

                </View>


                {labels?.map((label, index) => {
                    return (
                        <View style={{flexDirection: 'row'}} key={index}>
                            <StyledText style={{...props?.theme?.textm, marginVertical: 5, fontWeight: 'bold'}}>{label?.name} </StyledText>
                            <View style={{flexDirection: 'row', flex: 1, flexWrap: 'wrap', }}>
                                {event?.eventResources?.[`${label?.name}`]?.map((item) => {
                                    return (
                                        <View style={{...localeContext?.complexTheme?.shade, paddingHorizontal: 5, paddingVertical: 2, borderRadius: 10, marginHorizontal: 5, marginVertical: 5}}>
                                            <StyledText style={{...props?.theme?.text, flexWrap: 'wrap', }}>{item?.resourceName}</StyledText>
                                        </View>
                                    )
                                })}
                            </View>
                        </View>
                    )
                })}


            </View>

        </TouchableOpacity>
    );
}

export const CalendarEvent = withNavigation(CalendarEventBase);