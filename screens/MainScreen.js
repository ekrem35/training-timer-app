/**
 * @flow
 */
import React, {Component} from 'react';
import {connect} from 'react-redux';
import {setStorage} from '../actions';
import {StyleSheet} from 'react-native';
import {
  Container,
  Content,
  Header,
  Text,
  Body,
  Title,
  Button,
  Footer,
  FooterTab,
  Icon,
  Right,
  View,
} from 'native-base';
import {TouchableOpacity} from 'react-native';
import {Timer} from 'react-native-stopwatch-timer';
import moment from 'moment';

type State = {
  periods: Array<{
    id: Number,
    timerStart: Boolean,
    totalDuration: Number,
    timerReset: Boolean,
    active: Boolean,
    duration: Number,
  }>,
};

type Props = {storage: State, saveState: (state: Object) => void};

class MainScreen extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {...props.storage, ...{temp: props.storage.periods}};
    this.currentTimes = {};
  }

  componentWillUnmount() {
    this.props.saveState(this.state);
  }

  createPeriod() {
    this.setState(prev => ({
      periods: [
        ...prev.periods,
        ...[
          {
            id: prev.periods.length,
            timerStart: false,
            totalDuration: prev.duration,
            timerReset: false,
            active: prev.periods.length === 0,
          },
        ],
      ],
    }));
  }

  toggleTimer(value = false, focused = -1) {
    const {periods} = this.state;
    const filteredArray = periods.filter(period => period.active === true);
    const index = filteredArray.length
      ? focused > -1
        ? focused
        : periods.findIndex(element => filteredArray[0].id === element.id)
      : 0;

    if (index < 0) {
      return false;
    }

    periods[index].timerStart = !periods[index].timerStart;
    periods[index].timerReset = false;

    this.setState({periods});
  }

  resetTimer() {
    const {periods} = this.state;
    const index = periods.findIndex(
      periods.filter(period => period.active === true)[0],
    );
    if (!index > -1) {
      return false;
    }
    periods[index].timerStart = false;
    periods[index].timerReset = true;
    this.setState({periods});
  }

  getFormattedTime(time, index) {
    this.currentTimes[index] = moment
      .duration(moment(time, 'HH:mm:ss.SSSS'))
      .hours();
  }

  handleFinish(index) {
    let {periods} = this.state;
    periods[index].active = false;
    console.log('handleFinish');
    this.setState({periods}, () => {
      if (periods[index + 1]) {
        console.log('next index', index + 1);
        periods[index + 1].active = true;
        this.toggleTimer(true, index + 1);
      }
    });
  }

  render() {
    const {periods} = this.state;
    return (
      <Container>
        <Header>
          <Body>
            <Title>Training Timer</Title>
          </Body>
          <Right style={styles.headerRight}>
            <TouchableOpacity
              style={styles.touchable}
              onPress={() => this.createPeriod()}>
              <Icon style={styles.headerRightIcon} name="add" />
            </TouchableOpacity>
          </Right>
        </Header>
        <Content>
          {periods.map((period, index) => (
            <View key={index} style={styles.timerContainer}>
              <Timer
                totalDuration={period.totalDuration}
                msecs
                start={period.timerStart}
                reset={period.timerReset}
                options={options}
                handleFinish={() => this.handleFinish(index)}
                getTime={time => this.getFormattedTime(time, index)}
              />
            </View>
          ))}
        </Content>
        <Footer>
          <FooterTab>
            <Button vertical onPress={() => this.setState({periods: []})}>
              <Icon name="trash" />
              <Text>Clear</Text>
            </Button>
            <Button vertical>
              <Icon name="refresh" onPress={() => this.resetTimer()} />
              <Text>Refresh</Text>
            </Button>
            <Button vertical>
              <Icon name="pause" onPress={() => this.toggleTimer(false)} />
              <Text>Wait</Text>
            </Button>
            <Button vertical onPress={() => this.toggleTimer(true)}>
              <Icon name="play" />
              <Text>Start</Text>
            </Button>
          </FooterTab>
        </Footer>
      </Container>
    );
  }
}

const options = {
  container: {
    backgroundColor: 'white',
    borderRadius: 5,
  },
  text: {
    fontSize: 42,
    color: '#222',
  },
};

const styles = StyleSheet.create({
  headerRightIcon: {color: 'white'},
  headerRight: {paddingRight: 15},
  touchable: {flexDirection: 'row'},
  touchText: {marginRight: 15, marginTop: 3, color: 'white'},
  timerContainer: {
    flex: 1,
    alignItems: 'center',
    marginVertical: 20,
  },
});

const mapStateToProps = state => ({
  storage: state.storage,
});

const mapDispatchToProps = dispatch => ({
  saveState: state => dispatch(setStorage(state)),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(MainScreen);
