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
  Card,
  CardItem,
  Button,
  Item,
} from 'native-base';

type Props = {storage: Object, saveState: (state: Object) => void};

class MainScreen extends Component<Props> {
  constructor(props) {
    super(props);
    this.state = props.storage;
  }

  componentWillUnmount() {
    this.props.saveState(this.state);
  }

  createPeriod() {
    this.setState(prev => ({
      periods: [...prev.periods, ...[{time: 160}]],
    }));
  }

  render() {
    const {periods} = this.state;
    return (
      <Container>
        <Header>
          <Body>
            <Title>Training Timer</Title>
          </Body>
        </Header>
        <Content>
          <Button success onPress={() => this.createPeriod()}>
            <Text>Add a period</Text>
          </Button>
          {periods.map((period, index) => (
            <Card key={index}>
              <CardItem>
                <Text>{period.time}</Text>
              </CardItem>
            </Card>
          ))}
        </Content>
        <Item style={styles.bottom}>
          <Button primary onPress={() => {}}>
            <Text>Clear All</Text>
          </Button>
          <Button warning onPress={() => {}}>
            <Text>Reset</Text>
          </Button>
          <Button danger onPress={() => {}}>
            <Text>Stop</Text>
          </Button>
          <Button success onPress={() => {}}>
            <Text>Start</Text>
          </Button>
        </Item>
      </Container>
    );
  }
}

const styles = StyleSheet.create({
  bottom: {justifyContent: 'space-around'},
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
