import React, {useEffect} from 'react'
import {Platform, View, Text} from 'react-native'
import SegmentedControlTab from "react-native-segmented-control-tab";
import styles from "../styles";
import {withContext} from "../helpers/contextHelper";

const SegmentedControl = props => {
  const {
    input: {onChange, value},
    values,
    selectedIndex,
    vertical,
    themeStyle,
    locale: {customMainThemeColor, customBackgroundColor},
    ...rest
  } = props


  const horizontalStyleProps = {
    tabsContainerStyle: {width: '100%'},
    tabStyle: {borderColor: customMainThemeColor, width: '100%', backgroundColor: customBackgroundColor, borderWidth: 1},
    tabTextStyle: {color: customMainThemeColor},
    activeTabStyle: {backgroundColor: customMainThemeColor}
  }

  const verticalStyleProps = {
    tabsContainerStyle: {width: '100%', flexDirection: 'column'},
    tabStyle: {borderColor: customMainThemeColor, width: '100%', backgroundColor: customBackgroundColor, borderWidth: 1},
    tabTextStyle: {color: customMainThemeColor},
    activeTabStyle: {backgroundColor: customMainThemeColor}
  }

  const andriodLine = (Platform.OS === "android") ? {firstTabStyle: {borderWidth: 1.2}, lastTabStyle: {borderWidth: 1.2}} : null

  useEffect(() => {
    if (!!selectedIndex || selectedIndex === 0) {
      onChange(selectedIndex)
    }

  }, []);

  return (
    <View>
      <SegmentedControlTab
        values={values}
        selectedIndex={selectedIndex ?? value}
        onTabPress={onChange}
        {...(vertical ? verticalStyleProps : horizontalStyleProps)}
        {...andriodLine}
        {...rest}
      />
      {!!props?.meta && !props?.meta?.valid && props?.meta?.touched && <Text style={[styles.rootError]}>{props?.meta?.error}</Text>}
    </View>
  )
}

export default withContext(SegmentedControl)
