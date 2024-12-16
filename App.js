import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, Alert, SafeAreaView, Modal, Image, ScrollView, FlatList } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showSignUp, setShowSignUp] = useState(false);
  const [signUpData, setSignUpData] = useState({ firstName: '', lastName: '', email: '', password: '' });
  const [showChannels, setShowChannels] = useState(false);
  const [activeChannel, setActiveChannel] = useState(null);
  const [showAddRole, setShowAddRole] = useState(false);
  const [selectedRole, setSelectedRole] = useState('');
  const [name, setName] = useState('');
  const [messages, setMessages] = useState([]);
  const [currentMessage, setCurrentMessage] = useState('');

  useEffect(() => {
    const checkLoginStatus = async () => {
      const status = await AsyncStorage.getItem('isLoggedIn');
      if (status === 'true') setIsLoggedIn(true);
    };
    checkLoginStatus();
  }, []);

  const handleLogin = async () => {
    const savedEmail = await AsyncStorage.getItem('email');
    const savedPassword = await AsyncStorage.getItem('password');

    if (email === savedEmail && password === savedPassword) {
      await AsyncStorage.setItem('isLoggedIn', 'true');
      setIsLoggedIn(true);
      Alert.alert('Success', 'Logged in successfully!');
    } else {
      Alert.alert('Error', 'Invalid email or password');
    }
  };

  const handleSignUp = async () => {
    const { firstName, lastName, email, password } = signUpData;
    if (!firstName || !lastName || !email || !password) {
      Alert.alert('Error', 'All fields are required');
      return;
    }
    await AsyncStorage.setItem('email', email);
    await AsyncStorage.setItem('password', password);
    Alert.alert('Success', 'Sign Up Successful! You can now log in.');
    setShowSignUp(false);
  };

  const handleLogout = async () => {
    setIsLoggedIn(false);
    setShowChannels(false);
    setActiveChannel(null);
    await AsyncStorage.removeItem('isLoggedIn');
  };

  const handleAddUser = () => {
    if (!name || !selectedRole) {
      Alert.alert('Error', 'Please enter a name and select a role');
      return;
    }
    Alert.alert('Success', `User "${name}" added as ${selectedRole}`);
    setName('');
    setSelectedRole('');
    setShowAddRole(false);
  };

  const handleSendMessage = () => {
    if (currentMessage.trim() === '') return;
    setMessages((prevMessages) => [
      ...prevMessages,
      { id: Date.now().toString(), text: currentMessage },
    ]);
    setCurrentMessage('');
  };

  return (
    <SafeAreaView style={styles.container}>
      {!isLoggedIn ? (
        showSignUp ? (
          // Sign Up Screen
          <View style={styles.loginContainer}>
            <Image source={require('./assets/ubverse.png')} style={styles.logoLarge} />
            <Text style={styles.title}>Sign Up</Text>
            <TextInput
              placeholder="First Name"
              value={signUpData.firstName}
              onChangeText={(text) => setSignUpData({ ...signUpData, firstName: text })}
              style={styles.input}
            />
            <TextInput
              placeholder="Last Name"
              value={signUpData.lastName}
              onChangeText={(text) => setSignUpData({ ...signUpData, lastName: text })}
              style={styles.input}
            />
            <TextInput
              placeholder="Email"
              value={signUpData.email}
              onChangeText={(text) => setSignUpData({ ...signUpData, email: text })}
              style={styles.input}
              keyboardType="email-address"
            />
            <TextInput
              placeholder="Password"
              value={signUpData.password}
              onChangeText={(text) => setSignUpData({ ...signUpData, password: text })}
              style={styles.input}
              secureTextEntry
            />
            <TouchableOpacity style={styles.loginButton} onPress={handleSignUp}>
              <Text style={styles.buttonText}>Sign Up</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setShowSignUp(false)}>
              <Text style={styles.linkText}>Already have an account? Log In</Text>
            </TouchableOpacity>
          </View>
        ) : (
          // Login Screen
          <View style={styles.loginContainer}>
            <Image source={require('./assets/ubverse.png')} style={styles.logoLarge} />
            <Text style={styles.title}>Login</Text>
            <TextInput
              placeholder="Email"
              value={email}
              onChangeText={setEmail}
              style={styles.input}
              keyboardType="email-address"
            />
            <TextInput
              placeholder="Password"
              value={password}
              onChangeText={setPassword}
              style={styles.input}
              secureTextEntry
            />
            <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
              <Text style={styles.buttonText}>Login</Text>
            </TouchableOpacity>
            <TouchableOpacity>
              <Text style={styles.linkText}>Forgot Password?</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setShowSignUp(true)}>
              <Text style={styles.linkText}>Don’t have an account? Sign Up</Text>
            </TouchableOpacity>
          </View>
        )
      ) : (
        // Everything Else (Welcome Screen, Channels, Chat Area) remains the same
        activeChannel ? (
          // Chat Area (unchanged)
          <View style={styles.chatContainer}>
            <Text style={styles.chatTitle}>{activeChannel}</Text>
            <FlatList
              data={messages}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => (
                <View style={styles.messageBubble}>
                  <Text style={styles.messageText}>{item.text}</Text>
                </View>
              )}
              style={styles.messageList}
            />
            <View style={styles.messageInputContainer}>
              <TextInput
                placeholder="Type a message..."
                value={currentMessage}
                onChangeText={setCurrentMessage}
                style={styles.messageInput}
              />
              <TouchableOpacity style={styles.sendButton} onPress={handleSendMessage}>
                <Text style={styles.sendIcon}>➡</Text>
              </TouchableOpacity>
            </View>
            <TouchableOpacity style={styles.homeButton} onPress={() => setActiveChannel(null)}>
              <Text style={styles.buttonText}>🏠 Back to Channels</Text>
            </TouchableOpacity>
          </View>
        ) : (
          // Welcome Screen, Channels, Roles (unchanged)
          showChannels ? (
            <View style={styles.centerContent}>
              <View style={styles.header}>
                <Image source={require('./assets/ubverse.png')} style={styles.logo} />
                <Text style={styles.headerText}>UBverse</Text>
              </View>
              <Text style={styles.title}>Your Channels</Text>
              {['BSIT 3-3', 'Third Year IT Peeps', 'Codes for Beginners'].map((channel, index) => (
                <TouchableOpacity key={index} style={styles.channelButton} onPress={() => setActiveChannel(channel)}>
                  <Text style={styles.channelText}>🔴 {channel}</Text>
                </TouchableOpacity>
              ))}
              <TouchableOpacity style={styles.homeButton} onPress={() => setShowChannels(false)}>
                <Text style={styles.buttonText}>🏠 Back to Home</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <ScrollView contentContainerStyle={styles.centerContent}>
              <View style={styles.header}>
                <Image source={require('./assets/ubverse.png')} style={styles.logo} />
                <Text style={styles.headerText}>UBverse</Text>
              </View>
              <TouchableOpacity style={styles.channelsButtonTop} onPress={() => setShowChannels(true)}>
                <Text style={styles.buttonText}>Your Channels</Text>
              </TouchableOpacity>
              <Text style={styles.title}>Create Channel</Text>
              {['Admin', 'Moderator', 'Member'].map((roleItem, index) => (
                <View key={index} style={styles.roleRow}>
                  <Text style={styles.roleText}>{roleItem}</Text>
                  <TouchableOpacity
                    style={styles.addRoleButtonInline}
                    onPress={() => {
                      setSelectedRole(roleItem);
                      setShowAddRole(true);
                    }}
                  >
                    <Text style={styles.plusSignInline}>+</Text>
                  </TouchableOpacity>
                </View>
              ))}
              <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
                <Text style={styles.buttonText}>Logout</Text>
              </TouchableOpacity>
            </ScrollView>
          )
        )
      )}

      {/* Add Role Modal */}
      <Modal visible={showAddRole} transparent animationType="slide">
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Add Role</Text>
            <TextInput
              placeholder="Enter Name"
              value={name}
              onChangeText={setName}
              style={styles.input}
            />
            <Text style={styles.modalLabel}>Selected Role: {selectedRole}</Text>
            <TouchableOpacity style={styles.loginButton} onPress={handleAddUser}>
              <Text style={styles.buttonText}>Add</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.loginButton, { backgroundColor: 'gray' }]}
              onPress={() => setShowAddRole(false)}
            >
              <Text style={styles.buttonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  loginContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', paddingHorizontal: 20 },
  logoLarge: { width: 120, height: 120, marginBottom: 20 },
  title: { fontSize: 28, fontWeight: 'bold', color: '#800000', marginBottom: 20 },
  input: { width: '100%', borderWidth: 1, borderColor: '#ccc', borderRadius: 8, padding: 12, marginBottom: 10 },
  loginButton: { backgroundColor: '#800000', padding: 12, borderRadius: 8, width: '100%', alignItems: 'center', marginTop: 10 },
  buttonText: { color: '#fff', fontWeight: 'bold' },
  linkText: { color: '#800000', marginTop: 10, textDecorationLine: 'underline' },
  header: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', backgroundColor: '#800000', padding: 10 },
  headerText: { fontSize: 28, fontWeight: 'bold', color: '#fff' },
  logo: { width: 50, height: 50, marginRight: 10 },
  centerContent: { flex: 1, justifyContent: 'center', alignItems: 'center', paddingHorizontal: 20 },
  logoutButton: { backgroundColor: '#f44336', padding: 12, borderRadius: 8, marginTop: 20, width: '100%', alignItems: 'center' },
  roleRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', width: '100%', marginBottom: 10 },
  roleText: { fontSize: 18, fontWeight: 'bold', color: '#800000' },
  addRoleButtonInline: { backgroundColor: '#800000', borderRadius: 20, width: 40, height: 40, justifyContent: 'center', alignItems: 'center' },
  plusSignInline: { color: '#fff', fontSize: 24, fontWeight: 'bold' },
  modalContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.5)' },
  modalContent: { backgroundColor: '#fff', padding: 20, borderRadius: 10, width: '80%' },
  modalTitle: { fontSize: 22, fontWeight: 'bold', marginBottom: 10 },
  modalLabel: { marginTop: 10, fontSize: 16 },
  channelsButtonTop: { position: 'absolute', top: 20, right: 20, backgroundColor: '#800000', padding: 10, borderRadius: 8 },
  channelButton: { backgroundColor: '#f1f1f1', padding: 15, marginVertical: 5, borderRadius: 8, width: '80%', alignItems: 'center' },
  channelText: { fontSize: 18, fontWeight: 'bold' },
  chatContainer: { flex: 1, padding: 10 },
  chatTitle: { fontSize: 24, fontWeight: 'bold', marginBottom: 10, color: '#800000' },
  messageList: { flex: 1, marginBottom: 10 },
  messageBubble: { padding: 10, backgroundColor: '#f1f1f1', borderRadius: 10, marginBottom: 5 },
  messageText: { fontSize: 16 },
  messageInputContainer: { flexDirection: 'row', alignItems: 'center', marginTop: 10 },
  messageInput: { flex: 1, borderWidth: 1, borderColor: '#ccc', borderRadius: 8, padding: 10, marginRight: 10 },
  sendButton: { backgroundColor: '#800000', borderRadius: 8, padding: 10 },
  sendIcon: { color: '#fff', fontWeight: 'bold' },
});
