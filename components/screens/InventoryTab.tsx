import API from "@/services/api";
import React, { useEffect, useState } from "react";
import { Alert, Pressable, Text, View } from "react-native";

import InventoryDetails from "@/components/inventory/InventoryDetails";
import InventoryList from "@/components/inventory/InventoryList";
import InventoryModal from "@/components/inventory/InventoryModal";
import ConfirmDialog from "../inventory/ConfirmDialog";

interface Product {
    _id: string;
    name: string;
    category?: string;
    srp: number;
    sellingPrice: number;
    stock: number;
    createdAt: string;
    updatedAt: string;
}

export default function InventoryTab() {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(false);

    // modal states
    const [modalVisible, setModalVisible] = useState(false);
    const [editingProduct, setEditingProduct] = useState<Product | null>(null);

    // details modal
    const [detailsVisible, setDetailsVisible] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

    // delete confirmation
    const [confirmVisible, setConfirmVisible] = useState(false);
    const [deleteId, setDeleteId] = useState<string | null>(null);

    const requestDelete = (id: string) => {
        setDeleteId(id);
        setConfirmVisible(true);
    };

    // when user confirms
    const confirmDelete = async () => {
        if (!deleteId) return;
        try {
            await API.delete(`/products/${deleteId}`);
            fetchProducts();
        } catch (err) {
            console.error("Error deleting product:", err);
        } finally {
            setConfirmVisible(false);
            setDeleteId(null);
        }
    };

    // fetch products
    const fetchProducts = async () => {
        try {
            setLoading(true);
            const { data } = await API.get("/products");
            setProducts(data);
        } catch (err) {
            console.error("Error fetching products:", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProducts();
    }, []);

    // add
    const handleAdd = () => {
        setEditingProduct(null);
        setModalVisible(true);
    };

    // edit
    const handleEdit = (product: Product) => {
        setEditingProduct(product);
        setModalVisible(true);
    };

    // save (add/edit)
    const saveProduct = async (values: {
        name: string;
        category: string;
        srp: number;
        sellingPrice: number;
        stock: number;
    }) => {
        try {
            if (editingProduct) {
                // update
                await API.put(`/products/${editingProduct._id}`, values);
            } else {
                // add new
                await API.post(`/products`, values);
            }
            setModalVisible(false);
            setEditingProduct(null);
            fetchProducts(); // refresh
        } catch (err) {
            console.error("Error saving product:", err);
            Alert.alert("Error", "Failed to save product.");
        }
    };

    // delete
    const handleDelete = async (id: string) => {
        try {
            await API.delete(`/products/${id}`);
            fetchProducts(); // refresh list
        } catch (err) {
            console.error("Error deleting product:", err);
            Alert.alert("Error", "Failed to delete product.");
        }
    };

    // show details
    const handlePress = (product: Product) => {
        setSelectedProduct(product);
        setDetailsVisible(true);
    };

    return (
        <View className="flex-1 p-4 bg-background">
            <Text className="text-xl font-bold text-white mb-4">📦 Inventory</Text>

            {/* Product List */}
            <InventoryList
                products={products}
                loading={loading}
                onRefresh={fetchProducts}
                onEdit={handleEdit}
                onDelete={requestDelete}
                onPress={handlePress}
            />

            {/* Floating Add Button */}
            <Pressable
                onPress={handleAdd}
                className="absolute bottom-6 right-6 bg-accent rounded-full w-14 h-14 items-center justify-center shadow-lg"
            >
                <Text className="text-white text-2xl font-bold">+</Text>
            </Pressable>

            {/* Add/Edit Modal */}
            <InventoryModal
                visible={modalVisible}
                product={editingProduct}
                onClose={() => setModalVisible(false)}
                onSave={saveProduct}
            />

            {/* Product Details Modal */}
            <InventoryDetails
                visible={detailsVisible}
                product={selectedProduct}
                onClose={() => setDetailsVisible(false)}
            />

            <ConfirmDialog
                visible={confirmVisible}
                title="Delete Product"
                message="Are you sure you want to delete this product? This action cannot be undone."
                onCancel={() => setConfirmVisible(false)}
                onConfirm={confirmDelete}
            />
        </View>
    );
}
