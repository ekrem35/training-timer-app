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
  Footer,
  FooterTab,
  Icon,
  Right,
} from 'native-base';
import {TouchableOpacity} from 'react-native';

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
      periods: [...prev.periods, ...[{time: 160, delay: 80}]],
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
          <Right style={styles.headerRight}>
            <TouchableOpacity
              style={styles.touchable}
              onPress={() => this.createPeriod()}>
              <Text style={styles.touchText}>Add a period</Text>
              <Icon style={styles.headerRightIcon} name="add" />
            </TouchableOpacity>
          </Right>
        </Header>
        <Content>
          {periods.map((period, index) => (
            <Card key={index}>
              <CardItem>
                <Text>{period.time}</Text>
              </CardItem>
              <CardItem>
                <Text>{period.delay}</Text>
              </CardItem>
            </Card>
          ))}
        </Content>
        <Footer>
          <FooterTab>
            <Button vertical onPress={() => this.setState({periods: []})}>
              <Icon name="trash" />
              <Text>Clear</Text>
            </Button>
            <Button vertical>
              <Icon name="refresh" />
              <Text>Refresh</Text>
            </Button>
            <Button vertical>
              <Icon name="pause" />
              <Text>Wait</Text>
            </Button>
            <Button vertical>
              <Icon name="play" />
              <Text>Start</Text>
            </Button>
          </FooterTab>
        </Footer>
      </Container>
    );
  }
}

const styles = StyleSheet.create({
  headerRightIcon: {color: 'white'},
  headerRight: {paddingRight: 15},
  touchable: {flexDirection: 'row'},
  touchText: {marginRight: 15, marginTop: 3, color: 'white'},
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
