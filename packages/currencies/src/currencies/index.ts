// Currencies module - ISO 4217 and other currency definitions
// This module provides currency configurations and factory functions
// Importing this module auto-registers all ISO 4217 currencies in the global registry

import { currencyRegistry } from '@genkin/core';

// Major World Currencies
import { USD_CONFIG } from './iso4217/usd';
import { EUR_CONFIG } from './iso4217/eur';
import { GBP_CONFIG } from './iso4217/gbp';
import { JPY_CONFIG } from './iso4217/jpy';
import { CHF_CONFIG } from './iso4217/chf';
import { CAD_CONFIG } from './iso4217/cad';
import { AUD_CONFIG } from './iso4217/aud';
import { NZD_CONFIG } from './iso4217/nzd';
import { CNY_CONFIG } from './iso4217/cny';

// Asian Currencies
import { HKD_CONFIG } from './iso4217/hkd';
import { SGD_CONFIG } from './iso4217/sgd';
import { KRW_CONFIG } from './iso4217/krw';
import { INR_CONFIG } from './iso4217/inr';
import { THB_CONFIG } from './iso4217/thb';
import { MYR_CONFIG } from './iso4217/myr';
import { PHP_CONFIG } from './iso4217/php';
import { IDR_CONFIG } from './iso4217/idr';
import { VND_CONFIG } from './iso4217/vnd';

// European Currencies
import { SEK_CONFIG } from './iso4217/sek';
import { NOK_CONFIG } from './iso4217/nok';
import { DKK_CONFIG } from './iso4217/dkk';
import { PLN_CONFIG } from './iso4217/pln';
import { CZK_CONFIG } from './iso4217/czk';
import { HUF_CONFIG } from './iso4217/huf';
import { TRY_CONFIG } from './iso4217/try';
import { RUB_CONFIG } from './iso4217/rub';

// Middle Eastern Currencies
import { AED_CONFIG } from './iso4217/aed';
import { SAR_CONFIG } from './iso4217/sar';
import { KWD_CONFIG } from './iso4217/kwd';
import { BHD_CONFIG } from './iso4217/bhd';
import { OMR_CONFIG } from './iso4217/omr';
import { JOD_CONFIG } from './iso4217/jod';
import { ILS_CONFIG } from './iso4217/ils';
import { EGP_CONFIG } from './iso4217/egp';

// Other Currencies
import { BRL_CONFIG } from './iso4217/brl';
import { ZAR_CONFIG } from './iso4217/zar';
import { MXN_CONFIG } from './iso4217/mxn';
import { AFN_CONFIG } from './iso4217/afn';
import { ALL_CONFIG } from './iso4217/all';
import { AMD_CONFIG } from './iso4217/amd';
import { ANG_CONFIG } from './iso4217/ang';
import { AOA_CONFIG } from './iso4217/aoa';
import { ARS_CONFIG } from './iso4217/ars';
import { AWG_CONFIG } from './iso4217/awg';
import { AZN_CONFIG } from './iso4217/azn';
import { BAM_CONFIG } from './iso4217/bam';
import { BBD_CONFIG } from './iso4217/bbd';
import { BDT_CONFIG } from './iso4217/bdt';
import { BGN_CONFIG } from './iso4217/bgn';
import { BIF_CONFIG } from './iso4217/bif';
import { BMD_CONFIG } from './iso4217/bmd';
import { BND_CONFIG } from './iso4217/bnd';
import { BOB_CONFIG } from './iso4217/bob';
import { BOV_CONFIG } from './iso4217/bov';
import { BSD_CONFIG } from './iso4217/bsd';
import { BTN_CONFIG } from './iso4217/btn';
import { BWP_CONFIG } from './iso4217/bwp';
import { BYN_CONFIG } from './iso4217/byn';
import { BZD_CONFIG } from './iso4217/bzd';
import { CDF_CONFIG } from './iso4217/cdf';
import { CHE_CONFIG } from './iso4217/che';
import { CHW_CONFIG } from './iso4217/chw';
import { CLF_CONFIG } from './iso4217/clf';
import { CLP_CONFIG } from './iso4217/clp';
import { COP_CONFIG } from './iso4217/cop';
import { COU_CONFIG } from './iso4217/cou';
import { CRC_CONFIG } from './iso4217/crc';
import { CUC_CONFIG } from './iso4217/cuc';
import { CUP_CONFIG } from './iso4217/cup';
import { CVE_CONFIG } from './iso4217/cve';
import { DJF_CONFIG } from './iso4217/djf';
import { DOP_CONFIG } from './iso4217/dop';
import { DZD_CONFIG } from './iso4217/dzd';
import { ERN_CONFIG } from './iso4217/ern';
import { ETB_CONFIG } from './iso4217/etb';
import { FJD_CONFIG } from './iso4217/fjd';
import { FKP_CONFIG } from './iso4217/fkp';
import { GEL_CONFIG } from './iso4217/gel';
import { GHS_CONFIG } from './iso4217/ghs';
import { GIP_CONFIG } from './iso4217/gip';
import { GMD_CONFIG } from './iso4217/gmd';
import { GNF_CONFIG } from './iso4217/gnf';
import { GTQ_CONFIG } from './iso4217/gtq';
import { GYD_CONFIG } from './iso4217/gyd';
import { HNL_CONFIG } from './iso4217/hnl';
import { HRK_CONFIG } from './iso4217/hrk';
import { HTG_CONFIG } from './iso4217/htg';
import { IQD_CONFIG } from './iso4217/iqd';
import { IRR_CONFIG } from './iso4217/irr';
import { ISK_CONFIG } from './iso4217/isk';
import { JMD_CONFIG } from './iso4217/jmd';
import { KES_CONFIG } from './iso4217/kes';
import { KGS_CONFIG } from './iso4217/kgs';
import { KHR_CONFIG } from './iso4217/khr';
import { KMF_CONFIG } from './iso4217/kmf';
import { KPW_CONFIG } from './iso4217/kpw';
import { KYD_CONFIG } from './iso4217/kyd';
import { KZT_CONFIG } from './iso4217/kzt';
import { LAK_CONFIG } from './iso4217/lak';
import { LBP_CONFIG } from './iso4217/lbp';
import { LKR_CONFIG } from './iso4217/lkr';
import { LRD_CONFIG } from './iso4217/lrd';
import { LSL_CONFIG } from './iso4217/lsl';
import { LYD_CONFIG } from './iso4217/lyd';
import { MAD_CONFIG } from './iso4217/mad';
import { MDL_CONFIG } from './iso4217/mdl';
import { MGA_CONFIG } from './iso4217/mga';
import { MKD_CONFIG } from './iso4217/mkd';
import { MMK_CONFIG } from './iso4217/mmk';
import { MNT_CONFIG } from './iso4217/mnt';
import { MOP_CONFIG } from './iso4217/mop';
import { MRU_CONFIG } from './iso4217/mru';
import { MUR_CONFIG } from './iso4217/mur';
import { MVR_CONFIG } from './iso4217/mvr';
import { MWK_CONFIG } from './iso4217/mwk';
import { MXV_CONFIG } from './iso4217/mxv';
import { MZN_CONFIG } from './iso4217/mzn';
import { NAD_CONFIG } from './iso4217/nad';
import { NGN_CONFIG } from './iso4217/ngn';
import { NIO_CONFIG } from './iso4217/nio';
import { NPR_CONFIG } from './iso4217/npr';
import { PAB_CONFIG } from './iso4217/pab';
import { PEN_CONFIG } from './iso4217/pen';
import { PGK_CONFIG } from './iso4217/pgk';
import { PKR_CONFIG } from './iso4217/pkr';
import { PYG_CONFIG } from './iso4217/pyg';
import { QAR_CONFIG } from './iso4217/qar';
import { RON_CONFIG } from './iso4217/ron';
import { RSD_CONFIG } from './iso4217/rsd';
import { RWF_CONFIG } from './iso4217/rwf';
import { SBD_CONFIG } from './iso4217/sbd';
import { SCR_CONFIG } from './iso4217/scr';
import { SDG_CONFIG } from './iso4217/sdg';
import { SHP_CONFIG } from './iso4217/shp';
import { SLL_CONFIG } from './iso4217/sll';
import { SOS_CONFIG } from './iso4217/sos';
import { SRD_CONFIG } from './iso4217/srd';
import { SSP_CONFIG } from './iso4217/ssp';
import { STN_CONFIG } from './iso4217/stn';
import { SVC_CONFIG } from './iso4217/svc';
import { SYP_CONFIG } from './iso4217/syp';
import { SZL_CONFIG } from './iso4217/szl';
import { TJS_CONFIG } from './iso4217/tjs';
import { TMT_CONFIG } from './iso4217/tmt';
import { TND_CONFIG } from './iso4217/tnd';
import { TOP_CONFIG } from './iso4217/top';
import { TTD_CONFIG } from './iso4217/ttd';
import { TWD_CONFIG } from './iso4217/twd';
import { TZS_CONFIG } from './iso4217/tzs';
import { UAH_CONFIG } from './iso4217/uah';
import { UGX_CONFIG } from './iso4217/ugx';
import { USN_CONFIG } from './iso4217/usn';
import { UYI_CONFIG } from './iso4217/uyi';
import { UYU_CONFIG } from './iso4217/uyu';
import { UYW_CONFIG } from './iso4217/uyw';
import { UZS_CONFIG } from './iso4217/uzs';
import { VES_CONFIG } from './iso4217/ves';
import { VUV_CONFIG } from './iso4217/vuv';
import { WST_CONFIG } from './iso4217/wst';
import { XAF_CONFIG } from './iso4217/xaf';
import { XCD_CONFIG } from './iso4217/xcd';
import { XOF_CONFIG } from './iso4217/xof';
import { XPF_CONFIG } from './iso4217/xpf';
import { YER_CONFIG } from './iso4217/yer';
import { ZMW_CONFIG } from './iso4217/zmw';
import { ZWL_CONFIG } from './iso4217/zwl';

/**
 * All ISO 4217 currency configurations.
 * This array is used to auto-register currencies when this module is imported.
 */
export const ISO4217_CURRENCIES = [
  // Major World Currencies
  USD_CONFIG, EUR_CONFIG, GBP_CONFIG, JPY_CONFIG, CHF_CONFIG, CAD_CONFIG, AUD_CONFIG, NZD_CONFIG, CNY_CONFIG,
  // Asian Currencies
  HKD_CONFIG, SGD_CONFIG, KRW_CONFIG, INR_CONFIG, THB_CONFIG, MYR_CONFIG, PHP_CONFIG, IDR_CONFIG, VND_CONFIG,
  // European Currencies
  SEK_CONFIG, NOK_CONFIG, DKK_CONFIG, PLN_CONFIG, CZK_CONFIG, HUF_CONFIG, TRY_CONFIG, RUB_CONFIG,
  // Middle Eastern Currencies
  AED_CONFIG, SAR_CONFIG, KWD_CONFIG, BHD_CONFIG, OMR_CONFIG, JOD_CONFIG, ILS_CONFIG, EGP_CONFIG,
  // Other Currencies
  BRL_CONFIG, ZAR_CONFIG, MXN_CONFIG, AFN_CONFIG, ALL_CONFIG, AMD_CONFIG, ANG_CONFIG, AOA_CONFIG,
  ARS_CONFIG, AWG_CONFIG, AZN_CONFIG, BAM_CONFIG, BBD_CONFIG, BDT_CONFIG, BGN_CONFIG, BIF_CONFIG,
  BMD_CONFIG, BND_CONFIG, BOB_CONFIG, BOV_CONFIG, BSD_CONFIG, BTN_CONFIG, BWP_CONFIG, BYN_CONFIG,
  BZD_CONFIG, CDF_CONFIG, CHE_CONFIG, CHW_CONFIG, CLF_CONFIG, CLP_CONFIG, COP_CONFIG, COU_CONFIG,
  CRC_CONFIG, CUC_CONFIG, CUP_CONFIG, CVE_CONFIG, DJF_CONFIG, DOP_CONFIG, DZD_CONFIG, ERN_CONFIG,
  ETB_CONFIG, FJD_CONFIG, FKP_CONFIG, GEL_CONFIG, GHS_CONFIG, GIP_CONFIG, GMD_CONFIG, GNF_CONFIG,
  GTQ_CONFIG, GYD_CONFIG, HNL_CONFIG, HRK_CONFIG, HTG_CONFIG, IQD_CONFIG, IRR_CONFIG, ISK_CONFIG,
  JMD_CONFIG, KES_CONFIG, KGS_CONFIG, KHR_CONFIG, KMF_CONFIG, KPW_CONFIG, KYD_CONFIG, KZT_CONFIG,
  LAK_CONFIG, LBP_CONFIG, LKR_CONFIG, LRD_CONFIG, LSL_CONFIG, LYD_CONFIG, MAD_CONFIG, MDL_CONFIG,
  MGA_CONFIG, MKD_CONFIG, MMK_CONFIG, MNT_CONFIG, MOP_CONFIG, MRU_CONFIG, MUR_CONFIG, MVR_CONFIG,
  MWK_CONFIG, MXV_CONFIG, MZN_CONFIG, NAD_CONFIG, NGN_CONFIG, NIO_CONFIG, NPR_CONFIG, PAB_CONFIG,
  PEN_CONFIG, PGK_CONFIG, PKR_CONFIG, PYG_CONFIG, QAR_CONFIG, RON_CONFIG, RSD_CONFIG, RWF_CONFIG,
  SBD_CONFIG, SCR_CONFIG, SDG_CONFIG, SHP_CONFIG, SLL_CONFIG, SOS_CONFIG, SRD_CONFIG, SSP_CONFIG,
  STN_CONFIG, SVC_CONFIG, SYP_CONFIG, SZL_CONFIG, TJS_CONFIG, TMT_CONFIG, TND_CONFIG, TOP_CONFIG,
  TTD_CONFIG, TWD_CONFIG, TZS_CONFIG, UAH_CONFIG, UGX_CONFIG, USN_CONFIG, UYI_CONFIG, UYU_CONFIG,
  UYW_CONFIG, UZS_CONFIG, VES_CONFIG, VUV_CONFIG, WST_CONFIG, XAF_CONFIG, XCD_CONFIG, XOF_CONFIG,
  XPF_CONFIG, YER_CONFIG, ZMW_CONFIG, ZWL_CONFIG,
];

// Auto-register all ISO 4217 currencies in the global registry
currencyRegistry.registerAll(ISO4217_CURRENCIES);

// Major World Currencies
export { USD, USD_CONFIG, USD_CODE, createUSD } from './iso4217/usd';
export type { USDCode } from './iso4217/usd';
export { EUR, EUR_CONFIG, EUR_CODE, createEUR } from './iso4217/eur';
export type { EURCode } from './iso4217/eur';
export { GBP, GBP_CONFIG, GBP_CODE, createGBP } from './iso4217/gbp';
export type { GBPCode } from './iso4217/gbp';
export { JPY, JPY_CONFIG, JPY_CODE, createJPY } from './iso4217/jpy';
export type { JPYCode } from './iso4217/jpy';
export { CHF, CHF_CONFIG, CHF_CODE, createCHF } from './iso4217/chf';
export type { CHFCode } from './iso4217/chf';
export { CAD, CAD_CONFIG, CAD_CODE, createCAD } from './iso4217/cad';
export type { CADCode } from './iso4217/cad';
export { AUD, AUD_CONFIG, AUD_CODE, createAUD } from './iso4217/aud';
export type { AUDCode } from './iso4217/aud';
export { NZD, NZD_CONFIG, NZD_CODE, createNZD } from './iso4217/nzd';
export type { NZDCode } from './iso4217/nzd';
export { CNY, CNY_CONFIG, CNY_CODE, createCNY } from './iso4217/cny';
export type { CNYCode } from './iso4217/cny';

// Asian Currencies
export { HKD, HKD_CONFIG, HKD_CODE, createHKD } from './iso4217/hkd';
export type { HKDCode } from './iso4217/hkd';
export { SGD, SGD_CONFIG, SGD_CODE, createSGD } from './iso4217/sgd';
export type { SGDCode } from './iso4217/sgd';
export { KRW, KRW_CONFIG, KRW_CODE, createKRW } from './iso4217/krw';
export type { KRWCode } from './iso4217/krw';
export { INR, INR_CONFIG, INR_CODE, createINR } from './iso4217/inr';
export type { INRCode } from './iso4217/inr';
export { THB, THB_CONFIG, THB_CODE, createTHB } from './iso4217/thb';
export type { THBCode } from './iso4217/thb';
export { MYR, MYR_CONFIG, MYR_CODE, createMYR } from './iso4217/myr';
export type { MYRCode } from './iso4217/myr';
export { PHP, PHP_CONFIG, PHP_CODE, createPHP } from './iso4217/php';
export type { PHPCode } from './iso4217/php';
export { IDR, IDR_CONFIG, IDR_CODE, createIDR } from './iso4217/idr';
export type { IDRCode } from './iso4217/idr';
export { VND, VND_CONFIG, VND_CODE, createVND } from './iso4217/vnd';
export type { VNDCode } from './iso4217/vnd';

// European Currencies
export { SEK, SEK_CONFIG, SEK_CODE, createSEK } from './iso4217/sek';
export type { SEKCode } from './iso4217/sek';
export { NOK, NOK_CONFIG, NOK_CODE, createNOK } from './iso4217/nok';
export type { NOKCode } from './iso4217/nok';
export { DKK, DKK_CONFIG, DKK_CODE, createDKK } from './iso4217/dkk';
export type { DKKCode } from './iso4217/dkk';
export { PLN, PLN_CONFIG, PLN_CODE, createPLN } from './iso4217/pln';
export type { PLNCode } from './iso4217/pln';
export { CZK, CZK_CONFIG, CZK_CODE, createCZK } from './iso4217/czk';
export type { CZKCode } from './iso4217/czk';
export { HUF, HUF_CONFIG, HUF_CODE, createHUF } from './iso4217/huf';
export type { HUFCode } from './iso4217/huf';
export { TRY, TRY_CONFIG, TRY_CODE, createTRY } from './iso4217/try';
export type { TRYCode } from './iso4217/try';
export { RUB, RUB_CONFIG, RUB_CODE, createRUB } from './iso4217/rub';
export type { RUBCode } from './iso4217/rub';

// Middle Eastern Currencies
export { AED, AED_CONFIG, AED_CODE, createAED } from './iso4217/aed';
export type { AEDCode } from './iso4217/aed';
export { SAR, SAR_CONFIG, SAR_CODE, createSAR } from './iso4217/sar';
export type { SARCode } from './iso4217/sar';
export { KWD, KWD_CONFIG, KWD_CODE, createKWD } from './iso4217/kwd';
export type { KWDCode } from './iso4217/kwd';
export { BHD, BHD_CONFIG, BHD_CODE, createBHD } from './iso4217/bhd';
export type { BHDCode } from './iso4217/bhd';
export { OMR, OMR_CONFIG, OMR_CODE, createOMR } from './iso4217/omr';
export type { OMRCode } from './iso4217/omr';
export { JOD, JOD_CONFIG, JOD_CODE, createJOD } from './iso4217/jod';
export type { JODCode } from './iso4217/jod';
export { ILS, ILS_CONFIG, ILS_CODE, createILS } from './iso4217/ils';
export type { ILSCode } from './iso4217/ils';
export { EGP, EGP_CONFIG, EGP_CODE, createEGP } from './iso4217/egp';
export type { EGPCode } from './iso4217/egp';

// Other Currencies
export { BRL, BRL_CONFIG, BRL_CODE, createBRL } from './iso4217/brl';
export type { BRLCode } from './iso4217/brl';
export { ZAR, ZAR_CONFIG, ZAR_CODE, createZAR } from './iso4217/zar';
export type { ZARCode } from './iso4217/zar';
export { MXN, MXN_CONFIG, MXN_CODE, createMXN } from './iso4217/mxn';
export type { MXNCode } from './iso4217/mxn';
export { AFN, AFN_CONFIG, AFN_CODE, createAFN } from './iso4217/afn';
export type { AFNCode } from './iso4217/afn';
export { ALL, ALL_CONFIG, ALL_CODE, createALL } from './iso4217/all';
export type { ALLCode } from './iso4217/all';
export { AMD, AMD_CONFIG, AMD_CODE, createAMD } from './iso4217/amd';
export type { AMDCode } from './iso4217/amd';
export { ANG, ANG_CONFIG, ANG_CODE, createANG } from './iso4217/ang';
export type { ANGCode } from './iso4217/ang';
export { AOA, AOA_CONFIG, AOA_CODE, createAOA } from './iso4217/aoa';
export type { AOACode } from './iso4217/aoa';
export { ARS, ARS_CONFIG, ARS_CODE, createARS } from './iso4217/ars';
export type { ARSCode } from './iso4217/ars';
export { AWG, AWG_CONFIG, AWG_CODE, createAWG } from './iso4217/awg';
export type { AWGCode } from './iso4217/awg';
export { AZN, AZN_CONFIG, AZN_CODE, createAZN } from './iso4217/azn';
export type { AZNCode } from './iso4217/azn';
export { BAM, BAM_CONFIG, BAM_CODE, createBAM } from './iso4217/bam';
export type { BAMCode } from './iso4217/bam';
export { BBD, BBD_CONFIG, BBD_CODE, createBBD } from './iso4217/bbd';
export type { BBDCode } from './iso4217/bbd';
export { BDT, BDT_CONFIG, BDT_CODE, createBDT } from './iso4217/bdt';
export type { BDTCode } from './iso4217/bdt';
export { BGN, BGN_CONFIG, BGN_CODE, createBGN } from './iso4217/bgn';
export type { BGNCode } from './iso4217/bgn';
export { BIF, BIF_CONFIG, BIF_CODE, createBIF } from './iso4217/bif';
export type { BIFCode } from './iso4217/bif';
export { BMD, BMD_CONFIG, BMD_CODE, createBMD } from './iso4217/bmd';
export type { BMDCode } from './iso4217/bmd';
export { BND, BND_CONFIG, BND_CODE, createBND } from './iso4217/bnd';
export type { BNDCode } from './iso4217/bnd';
export { BOB, BOB_CONFIG, BOB_CODE, createBOB } from './iso4217/bob';
export type { BOBCode } from './iso4217/bob';
export { BOV, BOV_CONFIG, BOV_CODE, createBOV } from './iso4217/bov';
export type { BOVCode } from './iso4217/bov';
export { BSD, BSD_CONFIG, BSD_CODE, createBSD } from './iso4217/bsd';
export type { BSDCode } from './iso4217/bsd';
export { BTN, BTN_CONFIG, BTN_CODE, createBTN } from './iso4217/btn';
export type { BTNCode } from './iso4217/btn';
export { BWP, BWP_CONFIG, BWP_CODE, createBWP } from './iso4217/bwp';
export type { BWPCode } from './iso4217/bwp';
export { BYN, BYN_CONFIG, BYN_CODE, createBYN } from './iso4217/byn';
export type { BYNCode } from './iso4217/byn';
export { BZD, BZD_CONFIG, BZD_CODE, createBZD } from './iso4217/bzd';
export type { BZDCode } from './iso4217/bzd';
export { CDF, CDF_CONFIG, CDF_CODE, createCDF } from './iso4217/cdf';
export type { CDFCode } from './iso4217/cdf';
export { CHE, CHE_CONFIG, CHE_CODE, createCHE } from './iso4217/che';
export type { CHECode } from './iso4217/che';
export { CHW, CHW_CONFIG, CHW_CODE, createCHW } from './iso4217/chw';
export type { CHWCode } from './iso4217/chw';
export { CLF, CLF_CONFIG, CLF_CODE, createCLF } from './iso4217/clf';
export type { CLFCode } from './iso4217/clf';
export { CLP, CLP_CONFIG, CLP_CODE, createCLP } from './iso4217/clp';
export type { CLPCode } from './iso4217/clp';
export { COP, COP_CONFIG, COP_CODE, createCOP } from './iso4217/cop';
export type { COPCode } from './iso4217/cop';
export { COU, COU_CONFIG, COU_CODE, createCOU } from './iso4217/cou';
export type { COUCode } from './iso4217/cou';
export { CRC, CRC_CONFIG, CRC_CODE, createCRC } from './iso4217/crc';
export type { CRCCode } from './iso4217/crc';
export { CUC, CUC_CONFIG, CUC_CODE, createCUC } from './iso4217/cuc';
export type { CUCCode } from './iso4217/cuc';
export { CUP, CUP_CONFIG, CUP_CODE, createCUP } from './iso4217/cup';
export type { CUPCode } from './iso4217/cup';
export { CVE, CVE_CONFIG, CVE_CODE, createCVE } from './iso4217/cve';
export type { CVECode } from './iso4217/cve';
export { DJF, DJF_CONFIG, DJF_CODE, createDJF } from './iso4217/djf';
export type { DJFCode } from './iso4217/djf';
export { DOP, DOP_CONFIG, DOP_CODE, createDOP } from './iso4217/dop';
export type { DOPCode } from './iso4217/dop';
export { DZD, DZD_CONFIG, DZD_CODE, createDZD } from './iso4217/dzd';
export type { DZDCode } from './iso4217/dzd';
export { ERN, ERN_CONFIG, ERN_CODE, createERN } from './iso4217/ern';
export type { ERNCode } from './iso4217/ern';
export { ETB, ETB_CONFIG, ETB_CODE, createETB } from './iso4217/etb';
export type { ETBCode } from './iso4217/etb';
export { FJD, FJD_CONFIG, FJD_CODE, createFJD } from './iso4217/fjd';
export type { FJDCode } from './iso4217/fjd';
export { FKP, FKP_CONFIG, FKP_CODE, createFKP } from './iso4217/fkp';
export type { FKPCode } from './iso4217/fkp';
export { GEL, GEL_CONFIG, GEL_CODE, createGEL } from './iso4217/gel';
export type { GELCode } from './iso4217/gel';
export { GHS, GHS_CONFIG, GHS_CODE, createGHS } from './iso4217/ghs';
export type { GHSCode } from './iso4217/ghs';
export { GIP, GIP_CONFIG, GIP_CODE, createGIP } from './iso4217/gip';
export type { GIPCode } from './iso4217/gip';
export { GMD, GMD_CONFIG, GMD_CODE, createGMD } from './iso4217/gmd';
export type { GMDCode } from './iso4217/gmd';
export { GNF, GNF_CONFIG, GNF_CODE, createGNF } from './iso4217/gnf';
export type { GNFCode } from './iso4217/gnf';
export { GTQ, GTQ_CONFIG, GTQ_CODE, createGTQ } from './iso4217/gtq';
export type { GTQCode } from './iso4217/gtq';
export { GYD, GYD_CONFIG, GYD_CODE, createGYD } from './iso4217/gyd';
export type { GYDCode } from './iso4217/gyd';
export { HNL, HNL_CONFIG, HNL_CODE, createHNL } from './iso4217/hnl';
export type { HNLCode } from './iso4217/hnl';
export { HRK, HRK_CONFIG, HRK_CODE, createHRK } from './iso4217/hrk';
export type { HRKCode } from './iso4217/hrk';
export { HTG, HTG_CONFIG, HTG_CODE, createHTG } from './iso4217/htg';
export type { HTGCode } from './iso4217/htg';
export { IQD, IQD_CONFIG, IQD_CODE, createIQD } from './iso4217/iqd';
export type { IQDCode } from './iso4217/iqd';
export { IRR, IRR_CONFIG, IRR_CODE, createIRR } from './iso4217/irr';
export type { IRRCode } from './iso4217/irr';
export { ISK, ISK_CONFIG, ISK_CODE, createISK } from './iso4217/isk';
export type { ISKCode } from './iso4217/isk';
export { JMD, JMD_CONFIG, JMD_CODE, createJMD } from './iso4217/jmd';
export type { JMDCode } from './iso4217/jmd';
export { KES, KES_CONFIG, KES_CODE, createKES } from './iso4217/kes';
export type { KESCode } from './iso4217/kes';
export { KGS, KGS_CONFIG, KGS_CODE, createKGS } from './iso4217/kgs';
export type { KGSCode } from './iso4217/kgs';
export { KHR, KHR_CONFIG, KHR_CODE, createKHR } from './iso4217/khr';
export type { KHRCode } from './iso4217/khr';
export { KMF, KMF_CONFIG, KMF_CODE, createKMF } from './iso4217/kmf';
export type { KMFCode } from './iso4217/kmf';
export { KPW, KPW_CONFIG, KPW_CODE, createKPW } from './iso4217/kpw';
export type { KPWCode } from './iso4217/kpw';
export { KYD, KYD_CONFIG, KYD_CODE, createKYD } from './iso4217/kyd';
export type { KYDCode } from './iso4217/kyd';
export { KZT, KZT_CONFIG, KZT_CODE, createKZT } from './iso4217/kzt';
export type { KZTCode } from './iso4217/kzt';
export { LAK, LAK_CONFIG, LAK_CODE, createLAK } from './iso4217/lak';
export type { LAKCode } from './iso4217/lak';
export { LBP, LBP_CONFIG, LBP_CODE, createLBP } from './iso4217/lbp';
export type { LBPCode } from './iso4217/lbp';
export { LKR, LKR_CONFIG, LKR_CODE, createLKR } from './iso4217/lkr';
export type { LKRCode } from './iso4217/lkr';
export { LRD, LRD_CONFIG, LRD_CODE, createLRD } from './iso4217/lrd';
export type { LRDCode } from './iso4217/lrd';
export { LSL, LSL_CONFIG, LSL_CODE, createLSL } from './iso4217/lsl';
export type { LSLCode } from './iso4217/lsl';
export { LYD, LYD_CONFIG, LYD_CODE, createLYD } from './iso4217/lyd';
export type { LYDCode } from './iso4217/lyd';
export { MAD, MAD_CONFIG, MAD_CODE, createMAD } from './iso4217/mad';
export type { MADCode } from './iso4217/mad';
export { MDL, MDL_CONFIG, MDL_CODE, createMDL } from './iso4217/mdl';
export type { MDLCode } from './iso4217/mdl';
export { MGA, MGA_CONFIG, MGA_CODE, createMGA } from './iso4217/mga';
export type { MGACode } from './iso4217/mga';
export { MKD, MKD_CONFIG, MKD_CODE, createMKD } from './iso4217/mkd';
export type { MKDCode } from './iso4217/mkd';
export { MMK, MMK_CONFIG, MMK_CODE, createMMK } from './iso4217/mmk';
export type { MMKCode } from './iso4217/mmk';
export { MNT, MNT_CONFIG, MNT_CODE, createMNT } from './iso4217/mnt';
export type { MNTCode } from './iso4217/mnt';
export { MOP, MOP_CONFIG, MOP_CODE, createMOP } from './iso4217/mop';
export type { MOPCode } from './iso4217/mop';
export { MRU, MRU_CONFIG, MRU_CODE, createMRU } from './iso4217/mru';
export type { MRUCode } from './iso4217/mru';
export { MUR, MUR_CONFIG, MUR_CODE, createMUR } from './iso4217/mur';
export type { MURCode } from './iso4217/mur';
export { MVR, MVR_CONFIG, MVR_CODE, createMVR } from './iso4217/mvr';
export type { MVRCode } from './iso4217/mvr';
export { MWK, MWK_CONFIG, MWK_CODE, createMWK } from './iso4217/mwk';
export type { MWKCode } from './iso4217/mwk';
export { MXV, MXV_CONFIG, MXV_CODE, createMXV } from './iso4217/mxv';
export type { MXVCode } from './iso4217/mxv';
export { MZN, MZN_CONFIG, MZN_CODE, createMZN } from './iso4217/mzn';
export type { MZNCode } from './iso4217/mzn';
export { NAD, NAD_CONFIG, NAD_CODE, createNAD } from './iso4217/nad';
export type { NADCode } from './iso4217/nad';
export { NGN, NGN_CONFIG, NGN_CODE, createNGN } from './iso4217/ngn';
export type { NGNCode } from './iso4217/ngn';
export { NIO, NIO_CONFIG, NIO_CODE, createNIO } from './iso4217/nio';
export type { NIOCode } from './iso4217/nio';
export { NPR, NPR_CONFIG, NPR_CODE, createNPR } from './iso4217/npr';
export type { NPRCode } from './iso4217/npr';
export { PAB, PAB_CONFIG, PAB_CODE, createPAB } from './iso4217/pab';
export type { PABCode } from './iso4217/pab';
export { PEN, PEN_CONFIG, PEN_CODE, createPEN } from './iso4217/pen';
export type { PENCode } from './iso4217/pen';
export { PGK, PGK_CONFIG, PGK_CODE, createPGK } from './iso4217/pgk';
export type { PGKCode } from './iso4217/pgk';
export { PKR, PKR_CONFIG, PKR_CODE, createPKR } from './iso4217/pkr';
export type { PKRCode } from './iso4217/pkr';
export { PYG, PYG_CONFIG, PYG_CODE, createPYG } from './iso4217/pyg';
export type { PYGCode } from './iso4217/pyg';
export { QAR, QAR_CONFIG, QAR_CODE, createQAR } from './iso4217/qar';
export type { QARCode } from './iso4217/qar';
export { RON, RON_CONFIG, RON_CODE, createRON } from './iso4217/ron';
export type { RONCode } from './iso4217/ron';
export { RSD, RSD_CONFIG, RSD_CODE, createRSD } from './iso4217/rsd';
export type { RSDCode } from './iso4217/rsd';
export { RWF, RWF_CONFIG, RWF_CODE, createRWF } from './iso4217/rwf';
export type { RWFCode } from './iso4217/rwf';
export { SBD, SBD_CONFIG, SBD_CODE, createSBD } from './iso4217/sbd';
export type { SBDCode } from './iso4217/sbd';
export { SCR, SCR_CONFIG, SCR_CODE, createSCR } from './iso4217/scr';
export type { SCRCode } from './iso4217/scr';
export { SDG, SDG_CONFIG, SDG_CODE, createSDG } from './iso4217/sdg';
export type { SDGCode } from './iso4217/sdg';
export { SHP, SHP_CONFIG, SHP_CODE, createSHP } from './iso4217/shp';
export type { SHPCode } from './iso4217/shp';
export { SLL, SLL_CONFIG, SLL_CODE, createSLL } from './iso4217/sll';
export type { SLLCode } from './iso4217/sll';
export { SOS, SOS_CONFIG, SOS_CODE, createSOS } from './iso4217/sos';
export type { SOSCode } from './iso4217/sos';
export { SRD, SRD_CONFIG, SRD_CODE, createSRD } from './iso4217/srd';
export type { SRDCode } from './iso4217/srd';
export { SSP, SSP_CONFIG, SSP_CODE, createSSP } from './iso4217/ssp';
export type { SSPCode } from './iso4217/ssp';
export { STN, STN_CONFIG, STN_CODE, createSTN } from './iso4217/stn';
export type { STNCode } from './iso4217/stn';
export { SVC, SVC_CONFIG, SVC_CODE, createSVC } from './iso4217/svc';
export type { SVCCode } from './iso4217/svc';
export { SYP, SYP_CONFIG, SYP_CODE, createSYP } from './iso4217/syp';
export type { SYPCode } from './iso4217/syp';
export { SZL, SZL_CONFIG, SZL_CODE, createSZL } from './iso4217/szl';
export type { SZLCode } from './iso4217/szl';
export { TJS, TJS_CONFIG, TJS_CODE, createTJS } from './iso4217/tjs';
export type { TJSCode } from './iso4217/tjs';
export { TMT, TMT_CONFIG, TMT_CODE, createTMT } from './iso4217/tmt';
export type { TMTCode } from './iso4217/tmt';
export { TND, TND_CONFIG, TND_CODE, createTND } from './iso4217/tnd';
export type { TNDCode } from './iso4217/tnd';
export { TOP, TOP_CONFIG, TOP_CODE, createTOP } from './iso4217/top';
export type { TOPCode } from './iso4217/top';
export { TTD, TTD_CONFIG, TTD_CODE, createTTD } from './iso4217/ttd';
export type { TTDCode } from './iso4217/ttd';
export { TWD, TWD_CONFIG, TWD_CODE, createTWD } from './iso4217/twd';
export type { TWDCode } from './iso4217/twd';
export { TZS, TZS_CONFIG, TZS_CODE, createTZS } from './iso4217/tzs';
export type { TZSCode } from './iso4217/tzs';
export { UAH, UAH_CONFIG, UAH_CODE, createUAH } from './iso4217/uah';
export type { UAHCode } from './iso4217/uah';
export { UGX, UGX_CONFIG, UGX_CODE, createUGX } from './iso4217/ugx';
export type { UGXCode } from './iso4217/ugx';
export { USN, USN_CONFIG, USN_CODE, createUSN } from './iso4217/usn';
export type { USNCode } from './iso4217/usn';
export { UYI, UYI_CONFIG, UYI_CODE, createUYI } from './iso4217/uyi';
export type { UYICode } from './iso4217/uyi';
export { UYU, UYU_CONFIG, UYU_CODE, createUYU } from './iso4217/uyu';
export type { UYUCode } from './iso4217/uyu';
export { UYW, UYW_CONFIG, UYW_CODE, createUYW } from './iso4217/uyw';
export type { UYWCode } from './iso4217/uyw';
export { UZS, UZS_CONFIG, UZS_CODE, createUZS } from './iso4217/uzs';
export type { UZSCode } from './iso4217/uzs';
export { VES, VES_CONFIG, VES_CODE, createVES } from './iso4217/ves';
export type { VESCode } from './iso4217/ves';
export { VUV, VUV_CONFIG, VUV_CODE, createVUV } from './iso4217/vuv';
export type { VUVCode } from './iso4217/vuv';
export { WST, WST_CONFIG, WST_CODE, createWST } from './iso4217/wst';
export type { WSTCode } from './iso4217/wst';
export { XAF, XAF_CONFIG, XAF_CODE, createXAF } from './iso4217/xaf';
export type { XAFCode } from './iso4217/xaf';
export { XCD, XCD_CONFIG, XCD_CODE, createXCD } from './iso4217/xcd';
export type { XCDCode } from './iso4217/xcd';
export { XOF, XOF_CONFIG, XOF_CODE, createXOF } from './iso4217/xof';
export type { XOFCode } from './iso4217/xof';
export { XPF, XPF_CONFIG, XPF_CODE, createXPF } from './iso4217/xpf';
export type { XPFCode } from './iso4217/xpf';
export { YER, YER_CONFIG, YER_CODE, createYER } from './iso4217/yer';
export type { YERCode } from './iso4217/yer';
export { ZMW, ZMW_CONFIG, ZMW_CODE, createZMW } from './iso4217/zmw';
export type { ZMWCode } from './iso4217/zmw';
export { ZWL, ZWL_CONFIG, ZWL_CODE, createZWL } from './iso4217/zwl';
export type { ZWLCode } from './iso4217/zwl';

// Re-export core currency types for convenience
export type { Currency, CurrencyConfig, CurrencyCode, CurrencyFormatOptions } from '@genkin/core';
export { createCurrency, getCurrencyConfig, RoundingMode } from '@genkin/core';

// Re-export registry for convenience
export { CurrencyRegistry, currencyRegistry, createCurrencyRegistry } from '@genkin/core';
