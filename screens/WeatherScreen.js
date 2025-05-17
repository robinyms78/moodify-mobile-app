import { useState, useEffect } from 'react';
import {
    StyleSheet,
    Text,
    View,
    TouchableOpacity,
    TextInput,
    ActivityIndicator,
    SafeAreaView,
    ScrollView,
} from 'react-native';
import { Feather } from '@expo/vector-icons';

const WeatherApp = () => {
    const [currentForecastIndex, setCurrentForecastIndex] = useState(0);
    const [location, setLocation] = useState('Singapore');
    const [weatherData, setWeatherData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const fetchWeatherData = async() => {
        setLoading(true);
        setError(null);

        try {
            // Fetch weather data from Singapore API using four-day-outlook endpoint
            const response = await fetch('https://api-open.data.gov.sg/v2/real-time/api/four-day-outlook');
            const responseData = await response.json();
            console.log("data:", JSON.stringify(responseData, null, 2));

            if (!response.ok) {
                throw new Error('Failed to fetch weather data');
            }

            // Getting today's forecast (first day in the outlook)
            const record = responseData.data.records[0];
            const forecasts = record.forecasts;
            const todayForecast = forecasts && forecasts[0];
            console.log("Today's forecast: ", JSON.stringify(todayForecast, null, 2));

            const processedData = {
                location: location,
                temperature: {
                    min: todayForecast?.temperature?.low + '°C',
                    max: todayForecast?.temperature?.high + '°C',
                },
                humidity: {
                    min: todayForecast?.relativeHumidity?.low + '%',
                    max: todayForecast?.relativeHumidity?.high + '%',
                },
                forecast: todayForecast?.forecast?.text || 'No forecast available',
                forecastSummary: todayForecast?.forecast?.summary || '',
                windSpeed: {
                    min: todayForecast?.wind?.speed?.low + 'km/h',
                    max: todayForecast?.wind?.speed?.high + 'km/h',
                },
                windDirection: todayForecast?.wind?.direction || '',
                lastUpdated: new Date(record.updatedTimestamp).toLocaleDateString(),
                date: todayForecast?.timestamp ? new Date(todayForecast.timestamp).toLocaleTimeString() : 'Today',
                day: todayForecast?.day || '',
                // Store all forecasts for potential future use
                allForecasts: forecasts || [],
            };

            setWeatherData(processedData);
        } catch (err) {
            setError ('Failed to fetch weather data. Please try again.');
            console.error(err); 
        } finally {
            setLoading(false);
        }
    };

    const clearWeatherData = () => {
        setWeatherData(null);
        setCurrentForecastIndex(0);
    };

    const updateLocation = () => {
        if (weatherData) {
            fetchWeatherData();
        }
    };

    const showNextForecast = () => {
        if (weatherData && weatherData.allForecasts && weatherData.allForecasts.length > 0) {
            // Move to next forecast day, wrap around to first day if at the end
            setCurrentForecastIndex((prevIndex) =>
                (prevIndex + 1) % weatherData.allForecasts.length
            );
        }
    };

    // Update display with selected forecast day
    useEffect(() => {
        if (weatherData && weatherData.allForecasts && weatherData.allForecasts.length > 0) {
            const selectedForecast = weatherData.allForecasts[currentForecastIndex];

            setWeatherData(prevData => ({
                ...prevData,
                location: location,
                temperature: {
                    min: selectedForecast?.temperature?.low + '°C',
                    max: selectedForecast?.temperature?.high + '°C',
                },
                humidity: {
                    min: selectedForecast?.relativeHumidity?.low + '%',
                    max: selectedForecast?.relativeHumidity?.high + '%',
                },
                forecast: selectedForecast?.forecast?.text || 'No forecast available',
                forecastSummary: selectedForecast?.forecast?.summary || '',
                windSpeed: {
                    min: selectedForecast?.wind?.speed?.low + ' km/h',
                    max: selectedForecast?.wind?.speed?.high + ' km/h',
                },
                windDirection: selectedForecast?.wind?.direction || '',
                date: selectedForecast?.timestamp ? new Date(selectedForecast.timestamp).toLocaleDateString() : 'Today',
                day: selectedForecast?.day || '',
            }));
        }
    }, [currentForecastIndex, weatherData?.allForecasts, location]);

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.topContainer}>
                 <View style={styles.header}>
                    <Text style={styles.title}>Weather Information</Text>
                </View>

                {/* Fixed control panel - always visible */}
                <View style={styles.controlPanel}>
                {/* Get weather information */}
                    <View style={styles.buttonContainer}>
                        <TouchableOpacity
                            style={styles.button}
                            onPress={fetchWeatherData}
                        >
                            <Text style={styles.buttonText}>Get Weather</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={styles.button}
                            onPress={clearWeatherData}
                        >
                            <Text style={styles.buttonText}>Clear</Text>
                        </TouchableOpacity>
                    </View>

                    {/* Update location */}
                    <View style={styles.locationContainer}>
                        <TextInput
                            style={styles.locationInput}
                            value={location}
                            onChangeText={setLocation}
                            placeholder="Enter location"
                        />

                        <TouchableOpacity
                            style={styles.updateButton}
                            onPress={updateLocation}
                        >
                            <Text style={styles.updateButtonText}>Update Location</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
               
            {/* Scrollable content area */}
            <ScrollView
                style={styles.ScrollView}
                contentContainerStyle={styles.ScrollViewContent}    
            >
                {loading && (
                    <View style={styles.loadingContainer}>
                        <ActivityIndicator size="large" color="#3498db" />
                    </View>
                )}

                {error && (
                    <View style={styles.errorContainer}>
                        <Text style={styles.errorText}>{error}</Text>
                    </View>
                )}

                {weatherData && (
                    <View style={styles.weatherContainer}>
                        {/* Display weather location */}
                        <Text style={styles.weatherTitle}>
                            <Feather name="cloud" size={20} /> Weather in {weatherData.location}
                        </Text>

                        {/* Display weather date */}
                        <Text style={styles.dateText}>
                            {weatherData.day} - {weatherData.date}
                        </Text>

                        {/* Display forecast summary if available */}
                        {weatherData.forecastSummary && (
                            <Text style={styles.forecastSummary}>
                                {weatherData.forecastSummary}
                            </Text>
                        )}

                        {/* Display temperature */}
                        <View style={styles.weatherDetail}>
                            <Feather name="thermometer" size={18} color="#3498db" />
                            <Text style={styles.weatherText}>
                                Temperature: {weatherData.temperature.min} - {weatherData.temperature.max}
                            </Text>
                        </View>

                        {/* Display humidity */}
                        <View style={styles.weatherDetail}>
                            <Feather name="droplet" size={18} color="#3498db" />
                            <Text style={styles.weatherText}>
                                Humidity: {weatherData.humidity.min} - {weatherData.humidity.max}
                            </Text>
                        </View>

                        {/* Display rain information */}
                        <View style={styles.weatherDetail}>
                            <Feather name="cloud-rain" size={18} color="#3498db" />
                            <Text style={styles.weatherText}>
                                Forecast: {weatherData.forecast}
                            </Text>
                        </View>

                        {/* Display wind information */}
                        <View style={styles.weatherDetail}>
                            <Feather name="wind" size={18} color="#3498db" />
                            <Text style={styles.weatherText}>
                                Wind Speed: {weatherData.windSpeed.min} - {weatherData.windSpeed.max}
                                {weatherData.windDirection ? ` (${weatherData.windDirection})` : ''}
                            </Text>
                        </View>

                        {/* Display time */}
                        <View style={styles.weatherDetail}>
                            <Feather name="clock" size={18} color="#3498db" />
                            <Text style={styles.weatherText}>
                                Last Updated: {weatherData.lastUpdated}
                            </Text>
                        </View>

                        {weatherData.allForecasts && weatherData.allForecasts.length > 1 && (
                            <View style={styles.forecastNavigation}>
                                <Text style={styles.navigationText}>
                                    Day {currentForecastIndex + 1} of {weatherData.allForecasts.length}
                                </Text>
                            </View>
                        )}
                    </View>
                )}
                <View style={styles.spacer}></View>
            </ScrollView>            
    
            {/* Fixed footer - always at bottom */}
            <View style={styles.footer}>
                {/* Get next weather forecast */}
                <TouchableOpacity
                    style={styles.footerButton}
                    onPress={showNextForecast}
                    disabled={!weatherData || !weatherData.allForecasts || weatherData.allForecasts.length <= 1}
                >
                    <Text style={[
                        styles.footerButtonText,
                        (!weatherData || !weatherData.allForecasts || weatherData.allForecasts.length <= 1) && styles.disabledText
                    ]}>Next</Text>
                </TouchableOpacity>

                {/* Log out */}
                <TouchableOpacity style={styles.logoutButton}>
                    <Feather name="log-out" size={16} color="#666" />
                    <Text style={styles.logoutText}>logout</Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5',
    },
    topContainer: {
        width: '100%',
        backgroundColor: '#fff',
        paddingHorizontal: 15,
        paddingTop: 10,
        paddingBottom: 10,
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 1,
        zIndex: 10,
    },
    header: {
        backgroundColor: '#f8f9fa',
        paddingVertical: 12,
        borderRadius: 8,
        marginBottom: 15,
    },
    title: {
        fontSize: 18,
        fontWeight: 'bold',
        textAlign: 'center',
    },
    controlPanel: {
        width: '100%',
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 10,
    },
    button: {
        backgroundColor: '#3498db',
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 5,
        flex: 0.48,
        alignItems: 'center',
    },
    buttonText: {
        color: 'white',
        fontWeight: '500',
    },
    locationContainer: {
        flexDirection: 'row',
        marginBottom: 5,
    },
    locationInput: {
        flex: 1,
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 5,
        paddingHorizontal: 10,
        paddingVertical: 8,
        marginRight: 8,
    },
    updateButton: {
        backgroundColor: '#3498db',
        paddingVertical: 10,
        paddingHorizontal: 10,
        borderRadius: 5,
        justifyContent: 'center',
    },
    updateButtonText: {
        color: 'white',
        fontSize: 12,
        fontWeight: '500',
        textAlign: 'center',
    },
    scrollView: {
        flex: 1,
        width: '100%',
    },
    ScrollViewContent: {
        paddingHorizontal: 15,
        paddingVertical: 15,
    },
    loadingContainer: {
        padding: 20,
        alignItems: 'center',
    },
    errorContainer: {
        backgroundColor: '#ffebee',
        padding: 10,
        borderRadius: 5,
        marginBottom: 15,
    },
    errorText: {
        color: '#d32f2f',
    },
    weatherContainer: {
        backgroundColor: '#ffffff',
        padding: 15,
        borderRadius: 8,
        marginBottom: 15,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
        elevation: 1,
    },
    weatherTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 5,
    },
    dateText: {
        fontSize: 14,
        textAlign: 'center',
        marginBottom: 15,
        color: '#666',
    },
    weatherDetail: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10,
    },
    weatherText: {
        marginLeft: 10,
        fontSize: 14,
        color: '#333',
    },
    forecastNavigation: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 10,
        paddingTop: 10,
        borderTopWidth: 1,
        borderTopColor: '#eee',
    },
    navigationText: {
        color: '#666',
        fontSize: 12,
    },
    footer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 15,
        paddingVertical: 10,
        borderTopWidth: 1,
        borderTopColor: '#eee',
        backgroundColor: '#fff',
    },
    footerButton: {
        paddingVertical: 5,
        marginLeft: 40,
    },
    footerButtonText: {
        color: '#3498db',
        fontWeight: '500',
    },
    disabled: {
        color: '#ccc',
    },
    forecastSummary: {
        fontSize: 14,
        textAlign: 'center',
        marginBottom: 15,
        fontStyle: 'italic',
        color: '#555',
    },
    logoutButton: {
        flexDirection: 'row',
        alignItems: 'center',
        marginRight: 40,
    },
    logoutText: {
        marginLeft: 5,
        color: '#666',
    },
    spacer: {
        height: 20,
    },
});

export default WeatherApp;