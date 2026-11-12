// DEVICE

export const DEVICE_SERVICE = 'A5183278-CA65-45B7-B6C3-A68552F3026D';
export const DEVICE_INFO_CHARACTERISTIC =
    'A5183278-CA65-45B7-B6C3-A68552F3026E';

// TETHER REP

export const REP_ONE_TETHER_REP_SERVICE =
    'A5183278-CA65-45B7-B6C3-A68552F2026D';

export const REP_ONE_TETHER_REP_SUMMARY_CHARACTERISTIC =
    'A5183278-CA65-45B7-B6C3-A68552F20273';
export const REP_ONE_TETHER_SCALAR_TEST_CHARACTERISTIC =
    'A5183278-CA65-45B7-B6C3-A68552F20282';
export const REP_ONE_TETHER_CALIBRATION_CHARACTERISTIC =
    'A5183278-CA65-45B7-B6C3-A68552F20281';
export const REP_ONE_TETHER_BULK_DATA_CHARACTERISTIC =
    'A5183278-CA65-45B7-B6C3-A68552F20274';
export const REP_ONE_TETHER_BULK_DATA_START_CHARACTERISTIC =
    'A5183278-CA65-45B7-B6C3-A68552F20276';

// TETHER CONCENTRIC/ECCENTRIC
// Firmware built with the con/ecc variant (RepOneFirmware docs/Tether_Concentric_Eccentric.md) adds a tenth
// Device Information field with capability bits, and sends each rep's concentric and eccentric on the Kratos
// rep summary characteristic, in the Kratos layout plus a few fields.

export const DEVICE_INFO_DEVICE_FAMILY_INDEX = 8;
export const DEVICE_INFO_CAPABILITIES_INDEX = 9;
export const DEVICE_FAMILY_REP_ONE = 0;
export const CAPABILITY_CON_ECC_REPORT = 1 << 0;
export const CAPABILITY_PHASE_ORDER = 1 << 1;

export const REP_ONE_TETHER_PHASE_ORDER_CHARACTERISTIC =
    'A5183278-CA65-45B7-B6C3-A68552F20284';

// KRATOS REP

export const KRATOS_REP_SERVICE = 'A5183278-CA65-45B7-B6C3-A68552F4026D';
export const KRATOS_REP_SUMMARY_CHARACTERISTIC =
    'A5183278-CA65-45B7-B6C3-A68552F4026E';

// BATTERY

// https://btprodspecificationrefs.blob.core.windows.net/assigned-numbers/Assigned%20Number%20Types/Assigned%20Numbers.pdf

// 0000180F-0000-1000-8000-00805f9b34fb - 128 bit
// 0x180F - 16 bit
// 180F - short
export const BLE_BATTERY_SERVICE = '180F';

// 00002a19-0000-1000-8000-00805f9b34fb - 128 bit
// 0x2A19 - 16 bit
// 2A19 - short
export const BLE_BATTERY_CHARACTERISTIC = '2A19';

// DFU - NOTE that it's done automatically by the lib
