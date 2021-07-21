import React from 'react'
import {Field, reduxForm} from 'redux-form'
import {Keyboard, Text, TouchableOpacity, View, FlatList} from 'react-native'
import {connect} from 'react-redux'
import {isRequired, isNDigitsNumber} from '../validators'
import InputText from '../components/InputText'
import PinCodeInput from '../components/PinCodeInput'
import {getClientUsrs, resolveRoles} from '../actions'
import {EditPasswordPopUp} from '../components/EditPasswordPopUp'
import DeleteBtn from '../components/DeleteBtn'
import {api, dispatchFetchRequest} from '../constants/Backend'
import {LocaleContext} from '../locales/LocaleContext'
import SegmentedControl from "../components/SegmentedControl"
import ScreenHeader from "../components/ScreenHeader";
import DropDown from '../components/DropDown'
import Icon from 'react-native-vector-icons/Ionicons'
import styles from '../styles'
import {StyledText} from "../components/StyledText";
import {RenderRadioBtnMulti} from '../components/RadioItem'
import {ThemeScrollView} from "../components/ThemeScrollView";



class StaffFormScreen extends React.Component {
  static navigationOptions = {
    header: null
  }
  static contextType = LocaleContext

  constructor(props, context) {
    super(props, context)

    const selectedRoleIndex = this.props?.initialValues !== undefined ? this.props?.initialValues?.selectedRole : 0
    // console.log('props', this.props.initialValues)

    this.state = {
      selectedRole: selectedRoleIndex,
      roles: {
        0: {value: 'USER', label: context.t('roles.USER')},
        1: {value: 'MANAGER', label: context.t('roles.MANAGER')},
        2: {value: 'Owner', label: context.t('roles.OWNER')},
      }
    }
  }

  componentDidMount() {
    this.context.localize({
      en: {
        staffTitle: 'Staff',
        nickName: 'Nick Name',
        username: 'User Name',
        password: 'Password',
        role: 'Role',
        manager: 'Manager Role',
        passwordTitle: 'Password',
        editPassword: 'Edit Password',
        enterNewPassword: 'Enter New Password',
        roles: {
          USER: 'User',
          MANAGER: 'Manager',
          OWNER: 'Owner'
        },
        noRole: 'No Role Selected',
        editRole: 'Manage Roles',
        roleId: 'User Role',
        staffWorkingAreas: 'Staff Working Areas',

      },
      zh: {
        staffTitle: '員工',
        nickName: '暱稱',
        username: '使用者名稱',
        password: '密碼',
        role: '權限',
        manager: '主管權限',
        passwordTitle: '設定密碼',
        editPassword: '編輯密碼',
        enterNewPassword: '輸入新密碼',
        roles: {
          USER: '使用者',
          MANAGER: '管理者',
          OWNER: '老闆'
        },
        noRole: '未選',
        editRole: '管理權限',
        roleId: '使用者權限',
        staffWorkingAreas: '員工工作區',
      }
    })
  }

  shouldComponentUpdate(nextProps, nextState) {
    if (!!this.props?.isEditForm) {

      return nextState !== this.state ||
        nextProps != this.props
    } else {

      return nextState !== this.state
    }
  }

  handleDelete = values => {
    dispatchFetchRequest(
      api.clientUser.delete(values.name),
      {
        method: 'DELETE',
        withCredentials: true,
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json'
        }
      },
      response => {
        this.props.navigation.navigate('StaffsOverview')
        this.props.getClientUsrs()
      }
    ).then()
  }

  handleRoleSelection = (index) => {
    this.setState({selectedRole: index})
  }

  render() {
    const {
      handleSubmit,
      isEditForm,
      handleEditCancel,
      initialValues,
      onCancel,
      userRoles = [],
      workingareas = [],
      currentUser
    } = this.props
    const {t, isTablet, customMainThemeColor} = this.context

    const roleIdArr = [];
    userRoles !== undefined && userRoles.map(usrRole => roleIdArr.push({label: usrRole.roleName, value: usrRole.id}))
    const roles = Object.keys(this.state.roles).map(key => this.state.roles[key].label)

    return (
      <ThemeScrollView>
        <View style={[styles.fullWidthScreen, isTablet && styles.horizontalPaddingScreen]}>
          <View>
            <ScreenHeader title={t('staffTitle')}
              parentFullScreen={true} />

            <View style={styles.tableRowContainerWithBorder}>
              <View style={[styles.tableCellView, styles.flex(1)]}>
                <StyledText style={styles.fieldTitle}>{t('nickName')}</StyledText>
              </View>
              <View style={[styles.tableCellView, styles.justifyRight]}>
                <Field
                  name="nickname"
                  component={InputText}
                  placeholder={t('nickName')}
                  secureTextEntry={false}
                />
              </View>
            </View>

            <View style={styles.tableRowContainerWithBorder}>
              <View style={[styles.tableCellView, styles.flex(1)]}>
                <StyledText style={styles.fieldTitle}>{t('password')}</StyledText>
              </View>
              <View style={[styles.tableCellView, styles.justifyRight]}>
                {isEditForm ? (
                  <EditPasswordPopUp name={initialValues?.username} />
                ) : (
                    <Field
                      name="password"
                      component={PinCodeInput}
                      onChange={val => {
                        if (val.length === 4)
                          Keyboard.dismiss()
                      }}
                      customHeight={40}
                      editable={!isEditForm}
                      validate={isNDigitsNumber(4)}
                    />
                  )}

              </View>
            </View>

            <View style={styles.tableRowContainerWithBorder}>
              <View style={[styles.tableCellView, styles.flex(1)]}>
                <StyledText style={styles.fieldTitle}>{t('role')}</StyledText>
              </View>
              <View style={[styles.flex(2)]}>
                <Field
                  name="selectedRole"
                  component={SegmentedControl}
                  values={roles}
                  selectedIndex={this.state.selectedRole}
                  onChange={this.handleRoleSelection}
                  normalize={value => {
                    return resolveRoles(value)
                  }}
                />
              </View>
            </View>
            {/* wait api done */}
            {/* <View style={styles.tableRowContainerWithBorder}>
              <View style={[styles.tableCellView, styles.flex(1)]}>
                <StyledText style={styles.fieldTitle}>{t('roleId')}</StyledText>
              </View>
              <View style={[styles.tableCellView, styles.justifyRight]}>
                <Field
                  name="userRoleId"
                  component={DropDown}
                  placeholder={{value: null, label: t('noRole')}}
                  options={roleIdArr}
                  search
                  selection
                  fluid
                />
              </View>
            </View> */}
          </View>
          {/* wait api done */}
          {/* <View style={styles.tableRowContainerWithBorder}>
            <View style={[styles.tableCellView, styles.flex(1)]}>
              <StyledText style={styles.fieldTitle}>{t('editRole')}</StyledText>
            </View>
            <View style={[styles.tableCellView, styles.justifyRight]}>
              <Icon name="md-create"
                size={24}
                color={customMainThemeColor}
                onPress={() => this.props.navigation.navigate('ManageUserRole')}
              />
            </View>
          </View> */}

          <View style={[styles.sectionContainerWithBorder, {marginTop: 28, paddingBottom: 16, marginBottom: 0, alignItems: 'center'}]}>
            <StyledText style={styles.sectionTitleText}>{t('staffWorkingAreas')}</StyledText>
          </View>
          {workingareas && <FlatList
            data={workingareas}
            renderItem={({item}) => (

              <View style={[styles.tableRowContainerWithBorder]}>
                <Field
                  name="workingAreaIds"
                  component={RenderRadioBtnMulti}
                  customValue={item.id}
                  optionName={item.name}
                />
              </View>
            )}
            keyExtractor={(item, index) => index.toString()}
          />}

          <View style={[styles.bottom, styles.horizontalMargin]}>
            <TouchableOpacity onPress={handleSubmit}>
              <Text style={[styles?.bottomActionButton(customMainThemeColor), styles?.actionButton(customMainThemeColor)]}>
                {t('action.save')}
              </Text>
            </TouchableOpacity>

            {isEditForm ? (
              <View>
                <TouchableOpacity onPress={handleEditCancel}>
                  <Text
                    style={[styles?.bottomActionButton(customMainThemeColor), styles?.secondActionButton(this.context)]}
                  >
                    {t('action.cancel')}
                  </Text>
                </TouchableOpacity>
                <DeleteBtn
                  handleDeleteAction={this.handleDelete}
                  params={{
                    name: this.props.route.params.staffname
                  }}
                />
              </View>
            ) : (
                <View>
                  <TouchableOpacity onPress={onCancel}>
                    <Text
                      style={[styles?.bottomActionButton(customMainThemeColor), styles?.secondActionButton(this.context)]}
                    >
                      {t('action.cancel')}
                    </Text>
                  </TouchableOpacity>
                </View>
              )}
          </View>
        </View>
      </ThemeScrollView>
    )
  }
}

const mapStateToProps = state => ({
  currentUser: state.clientuser.data,
})

const mapDispatchToProps = dispatch => ({
  dispatch,
  getClientUsrs: () => dispatch(getClientUsrs())
})

StaffFormScreen = reduxForm({
  form: 'staffForm'
})(StaffFormScreen)



export default connect(
  mapStateToProps,
  mapDispatchToProps
)(StaffFormScreen)
