import React, { useState } from 'react';
import { 
  Settings, 
  Save, 
  Bell, 
  Shield, 
  User, 
  Palette,
  ShoppingCart,
  Eye,
  Mail,
  Clock,
  CheckCircle,
  AlertCircle,
  Loader
} from 'lucide-react';
import AdminLayout from '../../components/admin/AdminLayout';
import { useSettings } from '../../context/SettingsContext';

const AdminSettingsPage = () => {
  const { settings, updateSettings, loading, error } = useSettings();
  const [activeTab, setActiveTab] = useState('marketplace');
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);

  // Color palette definitions
  const colorPalettes = [
    {
      id: 'ocean-blue',
      name: 'Ocean Blue',
      description: 'Professional blue theme with clean aesthetics',
      colors: ['#0ea5e9', '#0284c7', '#0369a1', '#075985']
    },
    {
      id: 'sunset-orange',
      name: 'Sunset Orange',
      description: 'Warm and energetic orange-red palette',
      colors: ['#f97316', '#ea580c', '#dc2626', '#b91c1c']
    },
    {
      id: 'forest-green',
      name: 'Forest Green',
      description: 'Natural green theme inspired by nature',
      colors: ['#10b981', '#059669', '#047857', '#065f46']
    },
    {
      id: 'royal-purple',
      name: 'Royal Purple',
      description: 'Elegant purple theme with luxury feel',
      colors: ['#8b5cf6', '#7c3aed', '#6d28d9', '#5b21b6']
    },
    {
      id: 'rose-pink',
      name: 'Rose Pink',
      description: 'Soft and modern pink theme',
      colors: ['#f472b6', '#ec4899', '#db2777', '#be185d']
    },
    {
      id: 'teal-cyan',
      name: 'Teal Cyan',
      description: 'Fresh and modern teal-cyan combination',
      colors: ['#06b6d4', '#0891b2', '#0e7490', '#155e75']
    },
    {
      id: 'golden-amber',
      name: 'Golden Amber',
      description: 'Warm golden theme with rich tones',
      colors: ['#f59e0b', '#d97706', '#b45309', '#92400e']
    },
    {
      id: 'deep-indigo',
      name: 'Deep Indigo',
      description: 'Professional indigo with sophisticated appeal',
      colors: ['#6366f1', '#4f46e5', '#4338ca', '#3730a3']
    }
  ];

  const handleSaveSettings = async (newSettings: any) => {
    setIsSaving(true);
    setSaveError(null);
    setSaveSuccess(false);

    try {
      await updateSettings(newSettings);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (error) {
      console.error('Error saving settings:', error);
      setSaveError('Failed to save settings. Please try again.');
      setTimeout(() => setSaveError(null), 5000);
    } finally {
      setIsSaving(false);
    }
  };

  const handleMarketplaceModeToggle = async () => {
    const newSettings = {
      ...settings,
      marketplaceMode: !settings.marketplaceMode,
      // When switching to portfolio mode, disable marketplace features
      ...(settings.marketplaceMode ? {
        showPricesOnProjects: false,
        enableCheckoutProcess: false
      } : {})
    };
    await handleSaveSettings(newSettings);
  };

  const handleSettingToggle = async (settingKey: string, value: boolean) => {
    const newSettings = {
      ...settings,
      [settingKey]: value
    };
    await handleSaveSettings(newSettings);
  };

  const applyColorPalette = (paletteId: string) => {
    const palette = colorPalettes.find(p => p.id === paletteId);
    if (!palette) return;

    // Apply CSS custom properties
    const root = document.documentElement;
    root.style.setProperty('--color-primary', palette.colors[0]);
    root.style.setProperty('--color-primary-dark', palette.colors[1]);
    root.style.setProperty('--color-secondary', palette.colors[2]);
    root.style.setProperty('--color-accent', palette.colors[3]);

    // Add palette class to body
    document.body.className = document.body.className.replace(/palette-\w+/g, '');
    document.body.classList.add(`palette-${paletteId}`);

    // Save to settings
    handleSaveSettings({
      ...settings,
      colorPalette: paletteId
    });
  };

  const getCurrentPalette = () => {
    return colorPalettes.find(p => p.id === settings.colorPalette) || colorPalettes[5]; // Default to teal-cyan
  };

  const tabs = [
    { id: 'marketplace', label: 'Marketplace', icon: ShoppingCart },
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'security', label: 'Security', icon: Shield },
    { id: 'appearance', label: 'Appearance', icon: Eye },
    { id: 'color-palette', label: 'Color Palette', icon: Palette }
  ];

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center min-h-screen">
          <Loader className="h-8 w-8 animate-spin text-blue-600" />
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="px-4 sm:px-6 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-200">Settings</h1>
          <p className="text-slate-500 dark:text-slate-400">
            Manage your application settings and preferences
          </p>
        </div>

        {/* Status Messages */}
        {error && (
          <div className="mb-6 bg-red-50 dark:bg-red-900/20 text-red-800 dark:text-red-300 p-4 rounded-lg flex items-center">
            <AlertCircle className="h-5 w-5 mr-2" />
            {error}
          </div>
        )}

        {saveSuccess && (
          <div className="mb-6 bg-green-50 dark:bg-green-900/20 text-green-800 dark:text-green-300 p-4 rounded-lg flex items-center">
            <CheckCircle className="h-5 w-5 mr-2" />
            Settings saved successfully!
          </div>
        )}

        {saveError && (
          <div className="mb-6 bg-red-50 dark:bg-red-900/20 text-red-800 dark:text-red-300 p-4 rounded-lg flex items-center">
            <AlertCircle className="h-5 w-5 mr-2" />
            {saveError}
          </div>
        )}

        {/* Tab Navigation */}
        <div className="bg-white dark:bg-slate-800 rounded-lg shadow-sm mb-6">
          <div className="border-b border-slate-200 dark:border-slate-700">
            <nav className="flex space-x-8 px-6" aria-label="Tabs">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center space-x-2 ${
                      activeTab === tab.id
                        ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                        : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300 dark:text-slate-400 dark:hover:text-slate-300'
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </nav>
          </div>

          {/* Tab Content */}
          <div className="p-6">
            {/* Marketplace Settings */}
            {activeTab === 'marketplace' && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-medium text-slate-900 dark:text-slate-200 mb-4">
                    Marketplace Configuration
                  </h3>
                  <p className="text-slate-600 dark:text-slate-400 mb-6">
                    Configure how your website operates - as a marketplace for selling projects or as a portfolio showcase.
                  </p>
                </div>

                {/* Mode Toggle */}
                <div className="bg-slate-50 dark:bg-slate-700 rounded-lg p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className={`p-2 rounded-lg ${settings.marketplaceMode ? 'bg-green-100 dark:bg-green-900' : 'bg-blue-100 dark:bg-blue-900'}`}>
                        {settings.marketplaceMode ? (
                          <ShoppingCart className="h-5 w-5 text-green-600 dark:text-green-400" />
                        ) : (
                          <Eye className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                        )}
                      </div>
                      <div>
                        <h4 className="font-medium text-slate-900 dark:text-slate-200">
                          {settings.marketplaceMode ? 'Marketplace Mode' : 'Portfolio Mode'}
                        </h4>
                        <p className="text-sm text-slate-600 dark:text-slate-400">
                          {settings.marketplaceMode 
                            ? 'Full e-commerce functionality with payments and checkout'
                            : 'Portfolio showcase mode for displaying work samples'
                          }
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={handleMarketplaceModeToggle}
                      disabled={isSaving}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                        settings.marketplaceMode ? 'bg-green-600' : 'bg-slate-200 dark:bg-slate-600'
                      }`}
                    >
                      <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                          settings.marketplaceMode ? 'translate-x-6' : 'translate-x-1'
                        }`}
                      />
                    </button>
                  </div>
                </div>

                {/* Marketplace Features */}
                {settings.marketplaceMode && (
                  <div className="space-y-4">
                    <h4 className="font-medium text-slate-900 dark:text-slate-200">Marketplace Features</h4>
                    
                    {[
                      {
                        key: 'showPricesOnProjects',
                        title: 'Show Prices on Projects',
                        description: 'Display project prices on cards and detail pages'
                      },
                      {
                        key: 'enableCheckoutProcess',
                        title: 'Enable Checkout Process',
                        description: 'Allow customers to purchase projects through the checkout flow'
                      },
                      {
                        key: 'automaticDeliveryEnabled',
                        title: 'Automatic Document Delivery',
                        description: 'Automatically send project documents after successful payment'
                      },
                      {
                        key: 'paymentProcessingEnabled',
                        title: 'Payment Processing',
                        description: 'Enable UPI and other payment methods'
                      },
                      {
                        key: 'emailNotificationsEnabled',
                        title: 'Email Notifications',
                        description: 'Send order confirmations and delivery notifications'
                      },
                      {
                        key: 'orderAutoConfirmation',
                        title: 'Order Auto-Confirmation',
                        description: 'Automatically confirm orders after payment'
                      }
                    ].map((setting) => (
                      <div key={setting.key} className="flex items-center justify-between py-3 border-b border-slate-200 dark:border-slate-700 last:border-0">
                        <div>
                          <h5 className="font-medium text-slate-900 dark:text-slate-200">{setting.title}</h5>
                          <p className="text-sm text-slate-600 dark:text-slate-400">{setting.description}</p>
                        </div>
                        <button
                          onClick={() => handleSettingToggle(setting.key, !settings[setting.key as keyof typeof settings])}
                          disabled={isSaving}
                          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                            settings[setting.key as keyof typeof settings] ? 'bg-blue-600' : 'bg-slate-200 dark:bg-slate-600'
                          }`}
                        >
                          <span
                            className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                              settings[setting.key as keyof typeof settings] ? 'translate-x-6' : 'translate-x-1'
                            }`}
                          />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Profile Settings */}
            {activeTab === 'profile' && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-medium text-slate-900 dark:text-slate-200 mb-4">
                    Profile Settings
                  </h3>
                  <p className="text-slate-600 dark:text-slate-400 mb-6">
                    Manage your profile information and preferences.
                  </p>
                </div>
                
                <div className="bg-slate-50 dark:bg-slate-700 rounded-lg p-6">
                  <p className="text-slate-600 dark:text-slate-400">
                    Profile settings will be implemented in a future update.
                  </p>
                </div>
              </div>
            )}

            {/* Notifications Settings */}
            {activeTab === 'notifications' && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-medium text-slate-900 dark:text-slate-200 mb-4">
                    Notification Settings
                  </h3>
                  <p className="text-slate-600 dark:text-slate-400 mb-6">
                    Configure how and when you receive notifications.
                  </p>
                </div>
                
                <div className="bg-slate-50 dark:bg-slate-700 rounded-lg p-6">
                  <p className="text-slate-600 dark:text-slate-400">
                    Notification settings will be implemented in a future update.
                  </p>
                </div>
              </div>
            )}

            {/* Security Settings */}
            {activeTab === 'security' && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-medium text-slate-900 dark:text-slate-200 mb-4">
                    Security Settings
                  </h3>
                  <p className="text-slate-600 dark:text-slate-400 mb-6">
                    Manage your account security and access controls.
                  </p>
                </div>
                
                <div className="bg-slate-50 dark:bg-slate-700 rounded-lg p-6">
                  <p className="text-slate-600 dark:text-slate-400">
                    Security settings will be implemented in a future update.
                  </p>
                </div>
              </div>
            )}

            {/* Appearance Settings */}
            {activeTab === 'appearance' && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-medium text-slate-900 dark:text-slate-200 mb-4">
                    Appearance Settings
                  </h3>
                  <p className="text-slate-600 dark:text-slate-400 mb-6">
                    Customize the look and feel of your application.
                  </p>
                </div>
                
                <div className="bg-slate-50 dark:bg-slate-700 rounded-lg p-6">
                  <p className="text-slate-600 dark:text-slate-400">
                    Appearance settings will be implemented in a future update.
                  </p>
                </div>
              </div>
            )}

            {/* Color Palette Settings */}
            {activeTab === 'color-palette' && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-medium text-slate-900 dark:text-slate-200 mb-4">
                    Color Palette
                  </h3>
                  <p className="text-slate-600 dark:text-slate-400 mb-6">
                    Choose a color scheme for your website
                  </p>
                </div>

                {/* Color Palette Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {colorPalettes.map((palette) => {
                    const isSelected = settings.colorPalette === palette.id;
                    return (
                      <div
                        key={palette.id}
                        onClick={() => applyColorPalette(palette.id)}
                        className={`cursor-pointer rounded-lg border-2 p-4 transition-all duration-200 hover:shadow-md ${
                          isSelected 
                            ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20' 
                            : 'border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600'
                        }`}
                      >
                        {/* Color Swatches */}
                        <div className="flex space-x-1 mb-3">
                          {palette.colors.map((color, index) => (
                            <div
                              key={index}
                              className="w-6 h-6 rounded-full border border-white shadow-sm"
                              style={{ backgroundColor: color }}
                            />
                          ))}
                        </div>
                        
                        {/* Palette Info */}
                        <div>
                          <h4 className={`font-medium mb-1 ${
                            isSelected ? 'text-blue-700 dark:text-blue-300' : 'text-slate-900 dark:text-slate-200'
                          }`}>
                            {palette.name}
                            {isSelected && (
                              <CheckCircle className="inline-block w-4 h-4 ml-2 text-blue-600" />
                            )}
                          </h4>
                          <p className={`text-sm ${
                            isSelected ? 'text-blue-600 dark:text-blue-400' : 'text-slate-600 dark:text-slate-400'
                          }`}>
                            {palette.description}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Current Selection */}
                <div className="bg-slate-50 dark:bg-slate-700 rounded-lg p-4">
                  <div className="flex items-center space-x-3">
                    <div className="flex space-x-1">
                      {getCurrentPalette().colors.map((color, index) => (
                        <div
                          key={index}
                          className="w-4 h-4 rounded-full border border-white shadow-sm"
                          style={{ backgroundColor: color }}
                        />
                      ))}
                    </div>
                    <div>
                      <span className="font-medium text-slate-900 dark:text-slate-200">
                        Current: {getCurrentPalette().name}
                      </span>
                      <p className="text-sm text-slate-600 dark:text-slate-400">
                        {getCurrentPalette().description}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Save Status */}
        {isSaving && (
          <div className="fixed bottom-4 right-4 bg-blue-600 text-white px-4 py-2 rounded-lg shadow-lg flex items-center">
            <Loader className="h-4 w-4 mr-2 animate-spin" />
            Saving settings...
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default AdminSettingsPage;