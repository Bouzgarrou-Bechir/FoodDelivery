import React, { useEffect, useState } from "react";
import { ScrollView, Alert, ActivityIndicator } from "react-native";
import HeaderTabs from "../components/HeaderTabs";
import Screen from "../components/Screen";
import Categories from "../components/Categories";
import SearchBar from "../components/SearchBar";
import RestaurantItem from "../components/RestaurantItem";
import tailwind from "tailwind-react-native-classnames";
import { localRestaurants } from "../data/localRestaurants";
import colors from "../configs/colors";
import { useDispatch } from "react-redux";
import { addHome, addWork } from "../redux/slices/AdressSlice";
import {
  addRole,
  addRestaurantName,
  addRestaurantId,
} from "../redux/slices/RoleSlice";
import { doc, getDoc } from "firebase/firestore";
import {db, auth} from "../configs/firebase";
import {getAuth} from "firebase/auth";


const API_URL = process.env.API_URL;
const API_TOKEN = process.env.API_TOKEN;


const HomeScreen = () => {

    const auth = getAuth();

    const [restaurantData, setRestaurantData] = useState(localRestaurants);
    const [city, setCity] = useState("Los Angeles");
    const [activeTab, setActiveTab] = useState("Delivery");
    const [loading, setLoading] = useState(false);

    const getRestaurantsFromYelp = () => {
        const yelpUrl = `${API_URL}${city}`;

        const apiOptions = {
            headers: {
                Authorization: `Bearer ${API_TOKEN}`,
            },
        };
        setLoading(true);
        return fetch(yelpUrl, apiOptions)
            .then((res) => res.json())
            .then((json) => {
                setLoading(false);
                if (json.error) return Alert.alert("Sorry", json.error.description);
                setRestaurantData(
                    json?.businesses?.filter((business) =>
                        business.transactions.includes(activeTab.toLowerCase())
                    )
                );
            })
    };
    const dispatch = useDispatch();

    const docRef = doc(db, "users", auth.currentUser.uid);
    const docSnap =  getDoc(docRef).then((doc) => {
        dispatch(addHome(doc.data().Home));
        dispatch(addWork(doc.data().Work));
        dispatch(addRole(doc.data().role));
        dispatch(addRestaurantName(doc.data().RestaurantName));
        dispatch(addRestaurantId(doc.data().RestaurantId));
    })



    useEffect(() => {
        getRestaurantsFromYelp();
    }, [city, activeTab]);

    return (
        <Screen style={tailwind`bg-white flex-1`}>
            <HeaderTabs activeTab={activeTab} setActiveTab={setActiveTab}/>
            <SearchBar setCity={setCity} city={city}/>
            <ScrollView style={tailwind`flex-1`} showsVerticalScrollIndicator={false}>
                <Categories/>
                {loading && (
                    <ActivityIndicator
                        size="large"
                        color={colors.primary}
                        style={tailwind`mt-2 mb-6`}
                    />
                )}
                <RestaurantItem restaurantData={restaurantData} activeTab={activeTab}/>
            </ScrollView>
        </Screen>
    );
};

export default HomeScreen;
