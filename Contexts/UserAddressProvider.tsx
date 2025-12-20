// context/UserAddressContext.tsx
import React, { createContext, useContext, useState, ReactNode } from "react";
import { mysupabase } from "@/Supabase/SupabaseConfig";
import { userinterfce, AddressProps } from "@/types/interfaces";

interface UserAddressContextProps {
    currentUser: userinterfce | null;
    addresses: AddressProps[];
    loading: boolean;
    fetchAddresses: (user: any) => Promise<void>;
}

const UserAddressContext = createContext<UserAddressContextProps>({
    currentUser: null,
    addresses: [],
    loading: false,
    fetchAddresses: async (user: any) => { },
});

export const UserAddressProvider = ({ children }: { children: ReactNode }) => {
    const [currentUser, setCurrentUser] = useState<userinterfce | null>(null);
    const [addresses, setAddresses] = useState<AddressProps[]>([]);
    const [loading, setLoading] = useState(false);

    // Fetch current user and addresses lazily
    const fetchAddresses = async (user: any) => {
        setLoading(true);
        try {
            // Get current user


            if (!user) {
                setCurrentUser(null);
                setAddresses([]);
                setLoading(false);
                return;
            }

            setCurrentUser(user);

            // Fetch addresses
            const { data: addressesData, error } = await mysupabase
                .from("address")
                .select("*")
                .eq("user_id", user.id);

            console.log(addresses, 'this is current user')

            if (error) {
                console.error("Error fetching addresses:", error.message);
                setAddresses([]);
            } else {
                setAddresses(addressesData || []);
            }
        } catch (err) {
            console.error("Failed to fetch addresses:", err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <UserAddressContext.Provider
            value={{ currentUser, addresses, loading, fetchAddresses }}
        >
            {children}
        </UserAddressContext.Provider>
    );
};

export const useUserAddress = () => useContext(UserAddressContext);
