import React from 'react'
import { Field, reduxForm } from 'redux-form'
import { ScrollView, Text, View, RefreshControl } from 'react-native'
import { connect } from 'react-redux'
import Icon from 'react-native-vector-icons/Ionicons'
import AntDesignIcon from 'react-native-vector-icons/AntDesign'
import { Accordion, List, SwipeAction } from '@ant-design/react-native'
import { DismissKeyboard } from '../components/DismissKeyboard'
import BackBtn from '../components/BackBtn'
import PopUp from '../components/PopUp'
import { getProducts, clearLabel } from '../actions'
import styles from '../styles'
import { LocaleContext } from '../locales/LocaleContext'

class ProductRow extends React.Component {
  static navigationOptions = {
    header: null
  }

  static contextType = LocaleContext

  constructor(props, context) {
    super(props, context)

    context.localize({
      en: {
        productListTitle: 'Product List',
        ungrouped: 'Ungrouped'
      },
      zh: {
        productListTitle: '產品列表',
        ungrouped: '未分類'
      }
    })

    this.state = {
      activeSections: [],
      selectedProducts: [],
      refreshing: false,
      status: '',
      labelId: null,
      productId: null,
      t: context.t
    }
    this.onChange = activeSections => {
      this.setState({ activeSections })
    }
  }

  PanelHeader = (labelName, labelId) => {
    return (
      <View
        style={{
          width: '100%',
          marginRight: 8,
          paddingTop: 15,
          paddingBottom: 15
        }}
      >
        <Text style={{ fontSize: 16 }}>{labelName}</Text>
        {labelId !== '0' &&
          <AntDesignIcon
            name="ellipsis1"
            size={25}
            color="black"
            style={{position: 'absolute', right: 0, top: 15}}
            onPress={() => {
              this.props.navigation.navigate('CategoryCustomize', {
                labelId: labelId
              })
            }}
          />
        }
      </View>
    )
  }

  onOpenNP = (prodId, lblId) => {
    this.setState({
      productId: prodId,
      labelId: lblId
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
      label
    } = this.props
    const { t } = this.state

    var map = new Map(Object.entries(products))

    const right = [
      {
        text: <Icon name="md-create" size={25} color="#fff" />,
        onPress: () =>
          this.props.navigation.navigate('ProductEdit', {
            productId: this.state.productId,
            labelId: this.state.labelId
          }),
        style: { backgroundColor: '#f18d1a90' }
      }
    ]

    return (
      <ScrollView
        refreshControl={<RefreshControl refreshing={this.state.refreshing} />}
      >
        <DismissKeyboard>
          <View style={styles.container}>
            <BackBtn />
            <Text
              style={[
                styles.welcomeText,
                styles.orange_color,
                styles.textMedium,
                styles.textBold
              ]}
            >
              {t('productListTitle')}
            </Text>
            <PopUp
              navigation={navigation}
              toRoute1={'Category'}
              toRoute2={'Product'}
              textForRoute1={t('newItem.category')}
              textForRoute2={t('newItem.product')}
            />

            <Accordion
              onChange={this.onChange}
              activeSections={this.state.activeSections}
              duration={300}
            >
              {labels.map(lbl => (
                <Accordion.Panel
                  header={this.PanelHeader(lbl.label, lbl.id)}
                  key={lbl.id}
                >
                  <List>
                    {map.get(lbl.label).map(prd => (
                      <SwipeAction
                        autoClose={true}
                        right={right}
                        onOpen={() => this.onOpenNP(prd.id, lbl.id)}
                        onClose={() => {}}
                        key={prd.id}
                      >
                        <List.Item
                          style={{
                            backgroundColor: '#f1f1f1'
                          }}
                        >
                          {prd.name}
                        </List.Item>
                      </SwipeAction>
                    ))}
                  </List>
                </Accordion.Panel>
              ))}

              <Accordion.Panel
                header={this.PanelHeader(t('ungrouped'), '0')}
                key='ungrouped'
              >
                <List>
                  {map.get('ungrouped').map(prd => (
                    <SwipeAction
                      autoClose={true}
                      right={right}
                      onOpen={() => this.onOpenNP(prd.id, '0')}
                      onClose={() => {}}
                      key={prd.id}
                    >
                      <List.Item key={prd.id}
                        style={{
                          backgroundColor: '#f1f1f1'
                        }}
                      >
                        {prd.name}
                      </List.Item>
                    </SwipeAction>
                  ))}
                </List>
              </Accordion.Panel>
            </Accordion>
          </View>
        </DismissKeyboard>
      </ScrollView>
    )
  }
}

const mapDispatchToProps = (dispatch, props) => ({
  dispatch,
  getProducts: () => dispatch(getProducts()),
  clearLabel: () => dispatch(clearLabel())
})

ProductRow = reduxForm({
  form: 'productlist_searchform'
})(ProductRow)

export default connect(
  null,
  mapDispatchToProps
)(ProductRow)
