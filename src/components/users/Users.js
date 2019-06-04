import React, { Component } from 'react';
import { View, FlatList, StyleSheet, TouchableOpacity, Text, Image, Dimensions } from 'react-native';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { saveUsersAction } from './UsersContainer';
import { metrics, colors, fonts } from '../../theme/index.js';
import { FadeInOut } from '../animation/Animation.js';
import { getUsersApi } from '../../api/users.js';

const Overlay = (props) => {
  return (
    <View style={styles.overlay}>
      <FadeInOut style={{ flex: 1}}>
        <Image source={{ uri: props.overlayImage }} style={styles.overlayImage}/>
      </FadeInOut>
    </View>
  );
};


class Users extends Component {

  state = {
    isLoading: false,
    page: 1,
    overlayImage: null,
    overlay: false
  }

  componentDidMount = () => {
    this.getUsers();
  }

  getUsers = () => {
    this.updateLoading(true);
    return (
      getUsersApi(30, this.state.page)
        .then(res => {
          if (Array.isArray(res)){
            this.props.saveUsersAction(res);
          } else {
            this.handleErrors(res);
            this.props.saveUsersAction([]);
          }
          this.updateLoading(false);
        })
        .catch(err => this.handleErrors(err))
    );
  }

  loadMoreUsers = () => {
    this.setState({ page: this.state.page + 1}, () => {
      this.getUsers(30, this.state.page);
    });
  }

  updateLoading = bool => {
    this.setState({ isLoading: bool });
  }

  handleErrors = (err) => {
    this.updateLoading(false);
    alert(err.message);
  }

  renderUsers = ({ item }) => {
    return (
      <TouchableOpacity style={styles.itemContainer} onPress={() => this.renderOverlay(item)}>
        <Image source={{uri: item.owner.avatar_url}} style={styles.avatar}/>
        <View style={styles.filesContainer}>
          {
            Object.keys(item.files)
              .map((file, index) => <Text key={index} style={colors.text}>{item.files[file].filename}</Text>)
          }
        </View>
      </TouchableOpacity>
    );
  };

  renderOverlay = (item) => {
    this.setState({
      overlayImage: item.owner.avatar_url,
      overlay: true
    }, () => {
      setTimeout(() => {
        this.setState({ overlay: false });
      }, 2000);
    });
  }

  keyExtractor = (item, index) => item.id;

  render(){
    const { users } = this.props;

    return (
      <View style={styles.container}>
        <FlatList
          progressViewOffset={100}
          removeClippedSubviews={true}
          data={users}
          extraData={this.props}
          keyExtractor={this.keyExtractor}
          renderItem={this.renderUsers}
          renderOverlay={this.renderOverlay}
          initialNumToRender={15}
          refreshing={this.state.isLoading}
          onRefresh={() => false}
          onEndReachedThreshold={3}
          onEndReached={this.loadMoreUsers}
          ListEmptyComponent={() => !this.state.isLoading && <Text style={styles.emptyViewText}>No users found</Text> }
        />
        {
          this.state.overlay === true
          ? <Overlay overlayImage={this.state.overlayImage}/>
          : null
        }
      </View>
    );
  }
}

const stateToProps = state => ({
  users: state.usersReducer.users,
});

const dispatchToProps = dispatch => ({
  saveUsersAction: bindActionCreators(saveUsersAction, dispatch),
});

export default connect(stateToProps, dispatchToProps)(Users);

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  avatar: {
    width: 40,
    height: 40,
    margin: metrics.medium
  },
  itemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderColor: colors.grey,
  },
  text: {
    fontSize: fonts.size.medium,
    color: colors.grey,
  },
  filesContainer: {
    flex: 1,
  },
  emptyViewText: {
    alignSelf: 'center',
    margin: metrics.medium
  },
  overlay: {
    position: 'absolute',
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: Dimensions.get('window').height / 2 - 200,
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
    backgroundColor: 'transparent'
  },
  overlayImage: {
    width: 200,
    height: 200
  }
});
