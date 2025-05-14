import React from 'react';
import { View, TextInput, Text, Button, Alert, StyleSheet } from 'react-native';
import { useForm, Controller } from 'react-hook-form';

function LoginForm() {
  const { control, handleSubmit, getValues } = useForm({
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onLoginPress = () => {
    const { email, password } = getValues();

    if (!email && !password) {
      Alert.alert('Missing Information', 'Please enter your email address and password');
    } else if (!email) {
      Alert.alert('Missing Information', 'Please enter your email address');
    } else if (!password) {
      Alert.alert('Missing Information', 'Please enter your password');
    } else {
      Alert.alert('Login Successful', 'You have logged in successfully');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Build New Positive Habits</Text>
      <Text style={styles.header}>Welcome to our app! Start building positive habits today.</Text>

      {/* Email Input */}
      <View style={styles.inputContainer}>
        <Text>Email:</Text>
        <Controller
          control={control}
          name="email"
          render={({ field: { onChange, onBlur, value } }) => (
            <TextInput
              style={styles.input}
              placeholder="Enter your email"
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
              autoCapitalize="none"
              keyboardType="email-address"
            />
          )}
        />
      </View>

      {/* Password Input */}
      <View style={styles.inputContainer}>
        <Text>Password:</Text>
        <Controller
          control={control}
          name="password"
          render={({ field: { onChange, onBlur, value } }) => (
            <TextInput
              style={styles.input}
              placeholder="Enter your password"
              secureTextEntry
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
            />
          )}
        />
      </View>

      {/* Submit Button */}
      <Button title="Login" onPress={handleSubmit(onLoginPress)} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    flex: 1,
    justifyContent: 'center',
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
  },
  inputContainer: {
    marginBottom: 15,
  },
  input: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    paddingLeft: 10,
    borderRadius: 5,
  },
});

export default LoginForm;
