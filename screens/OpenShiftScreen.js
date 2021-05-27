import React, {useState, useContext, useEffect} from 'react';
import {Text, TouchableOpacity, View, StyleSheet, KeyboardAvoidingView, Keyboard} from 'react-native'
import {StyledText} from "../components/StyledText";
import styles from '../styles'
import {ThemeContainer} from "../components/ThemeContainer";
import {LocaleContext} from '../locales/LocaleContext'
import StyledTextInput from "../components/StyledTextInput";
import {handleOpenShift} from "../helpers/shiftActions";


/*
   Date   : 2021-03-04
   Author : GGGODLIN
   Content: props
        handleOpenShift:()=>{}      
        handleCancel:()=>{}

*/
export const OpenShiftScreen = (props) => {
    const {t, themeStyle, customMainThemeColor, customBackgroundColor, customBorderColor} = useContext(LocaleContext);
    const [openBalance, setOpenBalance] = useState(0);

    return (
        <ThemeContainer>
            <KeyboardAvoidingView style={{flex: 1}} behavior="height">
                <View style={styles.modalContainer}>
                    <View style={[styles.boxShadow, styles.popUpLayout, themeStyle, {backgroundColor: customBackgroundColor, borderColor: customBorderColor}]}>
                        <Text style={styles?.screenSubTitle(customMainThemeColor)}>
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
                                        setOpenBalance(value)
                                    }
                                    placeholder={t('openShift.enterAmount')}
                                    blurOnSubmit={true}
                                    keyboardType={`numeric`}
                                />
                            </View>
                        </View>
                        <View style={[styles.jc_alignIem_center, styles.flex_dir_row]}>
                            <View style={{width: '45%', marginHorizontal: 5}}>
                                <TouchableOpacity onPress={() => {
                                    Keyboard.dismiss()
                                    handleOpenShift(openBalance, () => props?.handleOpenShift())
                                }
                                }>
                                    <Text style={[styles?.bottomActionButton(customMainThemeColor), styles?.actionButton(customMainThemeColor)]}>
                                        {t('openShift.open')}
                                    </Text>
                                </TouchableOpacity>
                            </View>
                            <View style={{width: '45%', marginHorizontal: 5}}>
                                <TouchableOpacity
                                    onPress={() => {
                                        //this.props.navigation.navigate('LoginSuccess')
                                        props?.handleCancel()
                                    }}
                                >
                                    <Text style={[styles?.bottomActionButton(customMainThemeColor), styles?.secondActionButton(useContext(LocaleContext))]}>
                                        {t('openShift.cancel')}
                                    </Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                </View>
            </KeyboardAvoidingView>
        </ThemeContainer>
    )
}