import React, {Component} from "react"
import {Text, TouchableOpacity, View} from "react-native"
import styles from '../styles'
import Icon from "react-native-vector-icons/Ionicons"
import {LocaleContext} from "../locales/LocaleContext"
import {withNavigation} from "@react-navigation/compat"

class ScreenHeader extends Component {
  static contextType = LocaleContext

  render() {
    const {
      title,
      backNavigation,
      backAction,
      rightComponent,
      parentFullScreen,
      leftMenuIcon,
      style
    } = this.props

    const {t, customMainThemeColor} = this.context

    const displayBackButton = backNavigation !== undefined ? backNavigation : true
    const backActionToUse = backAction !== undefined ? backAction : () => this.props.navigation.goBack()

    return (
      <View style={[styles.screenTopContainer, (parentFullScreen && {marginHorizontal: 15}), style, {borderWidth: 0}]}>
        <View style={leftMenuIcon && {flexDirection: 'row'}, {width: '20%', alignItems: 'flex-start', borderWidth: 0}}>
          {displayBackButton && (
            <TouchableOpacity
              hitSlop={{top: 20, bottom: 20, left: 50, right: 50}}
              onPress={backActionToUse}
            >
              <View>
                <Icon name="chevron-back" size={32} style={styles?.buttonIconStyle(customMainThemeColor)} />
              </View>
            </TouchableOpacity>
          )}
          {leftMenuIcon && (
            <TouchableOpacity
              onPress={() => this.props.navigation.toggleDrawer()}
            >
              <View>
                <Icon name="md-menu" size={32} style={styles?.buttonIconStyle(customMainThemeColor)} />
              </View>
            </TouchableOpacity>
          )}
        </View>
        <Text style={[styles?.screenTitle(customMainThemeColor), {width: '60%', borderWidth: 0}]}>{title}</Text>
        <View style={{width: '20%', alignItems: 'flex-end', borderWidth: 0}}>
          {rightComponent}
        </View>
      </View>

    )
  }
}

export default withNavigation(ScreenHeader)
