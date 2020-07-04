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
  Input,
} from 'native-base';
import {TouchableOpacity, AppState, Modal} from 'react-native';
import {Timer} from 'react-native-stopwatch-timer';
import moment from 'moment';
import Tts from 'react-native-tts';

type State = {
  appState: 'active' | 'background' | 'inactive',
  currentTimes: Object,
  periods: Array<{
    id: Number,
    timerStart: Boolean,
    totalDuration: Number,
    timerReset: Boolean,
    active: Boolean,
    duration: Number,
    currentDuration: null | Number,
  }>,
};

type Props = {storage: State, saveState: (state: Object) => void};

class MainScreen extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = props.storage;
    this.currentTimes = {};
    this.saying = false;
  }

  componentGracefulUnmount() {
    let periodsWithCurrentTime = [];
    Promise.all(
      this.state.periods.map(async (period, index) => {
        period.currentDuration = this.currentTimes[index];
        periodsWithCurrentTime.push(period);
        return period;
      }),
    ).then(() =>
      this.props.saveState({
        ...this.state,
        ...{periods: periodsWithCurrentTime},
      }),
    );
  }

  handleAppStateChange = nextAppState => {
    if (nextAppState !== 'active') {
      this.componentGracefulUnmount();
    }
  };

  componentDidMount() {
    AppState.addEventListener('change', this.handleAppStateChange);
  }

  componentWillUnmount() {
    AppState.removeEventListener('change', this.handleAppStateChange);
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
            active: false,
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

    if (!periods[index]) {
      return false;
    }

    if (focused > -1 && periods[index - 1] && periods[index - 1].active) {
      periods[index - 1].active = false;
    }

    if (index < 0) {
      return false;
    }

    if (periods[index].timerStart === value) {
      return false;
    }

    periods[index].timerStart = value;
    periods[index].active = value;

    this.setState({periods});
  }

  resetTimer() {
    const {periods} = this.state;
    const index = periods.findIndex(
      periods.filter(period => period.active === true)[0],
    );
    if (index < 0) {
      return false;
    }
    periods[index].timerStart = false;
    periods[index].timerReset = true;
    this.setState({periods});
  }

  sayLastFive = (index = 0) => {
    this.saying = true;
    const words = ['five', 'four', 'tree', 'two', 'one'];
    setTimeout(() => {
      Tts.speak(words[index]);
      if (index + 1 < 5) {
        this.sayLastFive(index + 1);
      } else if (index === 4) {
        this.saying = false;
      }
    }, 1000);
  };

  getFormattedTime(timeString, index) {
    const {periods} = this.state;
    if (!periods[index]) {
      return false;
    }
    const formattedTime = moment(timeString, 'HH:mm:ss.SSSS').diff(
      moment().startOf('day'),
      'milliseconds',
    );
    this.currentTimes[index] = formattedTime;

    if (
      formattedTime < 6000 &&
      periods[index].active &&
      this.saying === false
    ) {
      this.sayLastFive();
    }
  }

  handleFinish(index) {
    const {periods} = this.state;
    if (!periods[index]) {
      return false;
    }
    if (periods[index].active) {
      if (!periods[index + 1]) {
        return false;
      }
      this.toggleTimer(true, index + 1);
    }
  }

  renderModal() {
    const {duration} = this.state;
    return (
      <Modal
        transparent
        onRequestClose={() => true}
        visible={!!this.state.showModal}>
        <View style={styles.modalContent}>
          <View style={styles.modalView}>
            <Text>Set addition time as second</Text>
            <Input
              style={styles.input}
              placeholder="Addition time"
              value={
                duration.length === 0
                  ? duration
                  : String(Number(duration) / 1000)
              }
              onChangeText={newText =>
                this.setState({
                  duration: Number(
                    newText.length === 0
                      ? newText
                      : String(Number(newText) * 1000),
                  ),
                })
              }
              keyboardType="numeric"
            />
            <Button
              disabled={duration.length === 0 || Number(duration) < 1}
              onPress={() => this.setState({showModal: false})}>
              <Text style={styles.buttonText}>OK</Text>
            </Button>
          </View>
        </View>
      </Modal>
    );
  }

  render() {
    const {periods} = this.state;
    return (
      <Container>
        {this.renderModal()}
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
                totalDuration={period.currentDuration || period.totalDuration}
                msecs
                start={period.timerStart}
                reset={period.timerReset}
                options={timerOptions}
                handleFinish={() => this.handleFinish(index)}
                getTime={time => this.getFormattedTime(time, index)}
              />
            </View>
          ))}
        </Content>
        <Footer>
          <FooterTab>
            <Button vertical onPress={() => this.setState({showModal: true})}>
              <Icon name="time" />
              <Text>TIME</Text>
            </Button>
            <Button
              vertical
              onPress={() => {
                this.setState({periods: []});
              }}>
              <Icon name="trash" />
              <Text>Clear</Text>
            </Button>
            <Button vertical>
              <Icon name="pause" onPress={() => this.toggleTimer()} />
              <Text>Wait</Text>
            </Button>
            <Button
              vertical
              onPress={() => {
                this.toggleTimer(true);
              }}>
              <Icon name="play" />
              <Text>Start</Text>
            </Button>
          </FooterTab>
        </Footer>
      </Container>
    );
  }
}

const timerOptions = {
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
  modalContent: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
    padding: 25,
  },
  modalView: {backgroundColor: '#eee', padding: 5, height: 120},
  input: {flex: 1, backgroundColor: '#aaa', maxHeight: 100},
  buttonText: {flex: 1, textAlign: 'center'},
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
