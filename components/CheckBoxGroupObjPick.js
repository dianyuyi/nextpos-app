import React from 'react'
import {Text, View} from 'react-native'
import {Checkbox} from '@ant-design/react-native'
import styles from '../styles'
import {StyledText} from "./StyledText";

export default class CheckBoxGroupObjPick extends React.Component {
  render() {
    const {
      input: { onBlur, onChange, onFocus, value },
      customValue,
      optionName,
      customarr,
      meta: { error, touched, valid },
      ...rest
    } = this.props
    const arr = [...this.props.input.value]

    const checkBoxes =
      customarr !== undefined &&
      customarr.map(ca => {
        const onChange = checked => {
          const arr = [...this.props.input.value]
          if (checked) {
            arr.push(ca)
          } else {
            arr.splice(arr.indexOf(ca.id), 1)
          }
          return this.props.input.onChange(arr)
        }

        return (
          <View
            style={[styles.tableRowContainerWithBorder]}
            key={ca.id}
          >
            <View style={[styles.tableCellView, {flex: 2}]}>
              <StyledText>{ca.name === undefined ? ca.optionValue : ca.name}</StyledText>
            </View>

            <View style={[styles.tableCellView, {flex: 1, justifyContent: 'flex-end'}]}>
              <Checkbox
                onChange={e => onChange(e.target.checked)}
              >
              </Checkbox>
            </View>
            {!valid && touched && <Text style={styles.rootError}>{error}</Text>}
          </View>
        )
      })

    return <View>{checkBoxes}</View>
  }
}
