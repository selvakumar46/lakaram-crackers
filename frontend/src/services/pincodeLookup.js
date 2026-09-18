// Comprehensive offline lookup for Indian Pincodes + Online fallback
const PINCODE_PREFIX_MAP = {
  // Tamil Nadu
  '600': { city: 'Chennai', state: 'Tamil Nadu' },
  '601': { city: 'Tiruvallur', state: 'Tamil Nadu' },
  '602': { city: 'Tiruvallur', state: 'Tamil Nadu' },
  '603': { city: 'Chengalpattu', state: 'Tamil Nadu' },
  '604': { city: 'Viluppuram', state: 'Tamil Nadu' },
  '605': { city: 'Puducherry', state: 'Tamil Nadu' },
  '606': { city: 'Tiruvannamalai', state: 'Tamil Nadu' },
  '607': { city: 'Cuddalore', state: 'Tamil Nadu' },
  '608': { city: 'Chidambaram', state: 'Tamil Nadu' },
  '609': { city: 'Mayiladuthurai', state: 'Tamil Nadu' },
  '610': { city: 'Tiruvarur', state: 'Tamil Nadu' },
  '611': { city: 'Nagapattinam', state: 'Tamil Nadu' },
  '612': { city: 'Kumbakonam', state: 'Tamil Nadu' },
  '613': { city: 'Thanjavur', state: 'Tamil Nadu' },
  '614': { city: 'Pattukkottai', state: 'Tamil Nadu' },
  '620': { city: 'Tiruchirappalli', state: 'Tamil Nadu' },
  '621': { city: 'Perambalur', state: 'Tamil Nadu' },
  '622': { city: 'Pudukkottai', state: 'Tamil Nadu' },
  '623': { city: 'Ramanathapuram', state: 'Tamil Nadu' },
  '624': { city: 'Dindigul', state: 'Tamil Nadu' },
  '625': { city: 'Madurai', state: 'Tamil Nadu' },
  '626': { city: 'Virudhunagar / Sivakasi', state: 'Tamil Nadu' },
  '627': { city: 'Tirunelveli', state: 'Tamil Nadu' },
  '628': { city: 'Thoothukudi', state: 'Tamil Nadu' },
  '629': { city: 'Kanyakumari', state: 'Tamil Nadu' },
  '630': { city: 'Sivaganga / Karaikudi', state: 'Tamil Nadu' },
  '631': { city: 'Arakkonam / Ranipet', state: 'Tamil Nadu' },
  '632': { city: 'Vellore', state: 'Tamil Nadu' },
  '635': { city: 'Krishnagiri / Hosur', state: 'Tamil Nadu' },
  '636': { city: 'Salem', state: 'Tamil Nadu' },
  '637': { city: 'Namakkal', state: 'Tamil Nadu' },
  '638': { city: 'Erode', state: 'Tamil Nadu' },
  '639': { city: 'Karur', state: 'Tamil Nadu' },
  '641': { city: 'Coimbatore', state: 'Tamil Nadu' },
  '642': { city: 'Pollachi', state: 'Tamil Nadu' },
  '643': { city: 'Nilgiris / Ooty', state: 'Tamil Nadu' },

  // Karnataka
  '560': { city: 'Bengaluru', state: 'Karnataka' },
  '561': { city: 'Bengaluru Rural', state: 'Karnataka' },
  '562': { city: 'Ramanagara', state: 'Karnataka' },
  '570': { city: 'Mysuru', state: 'Karnataka' },
  '571': { city: 'Mandya', state: 'Karnataka' },
  '572': { city: 'Tumakuru', state: 'Karnataka' },
  '573': { city: 'Hassan', state: 'Karnataka' },
  '574': { city: 'Dakshina Kannada', state: 'Karnataka' },
  '575': { city: 'Mangaluru', state: 'Karnataka' },
  '576': { city: 'Udupi', state: 'Karnataka' },
  '577': { city: 'Shivamogga', state: 'Karnataka' },
  '580': { city: 'Hubballi / Dharwad', state: 'Karnataka' },
  '581': { city: 'Uttara Kannada', state: 'Karnataka' },
  '583': { city: 'Ballari', state: 'Karnataka' },
  '584': { city: 'Raichur', state: 'Karnataka' },
  '585': { city: 'Kalaburagi', state: 'Karnataka' },
  '586': { city: 'Vijayapura', state: 'Karnataka' },
  '590': { city: 'Belagavi', state: 'Karnataka' },

  // Telangana
  '500': { city: 'Hyderabad', state: 'Telangana' },
  '501': { city: 'Ranga Reddy', state: 'Telangana' },
  '502': { city: 'Medak / Sangareddy', state: 'Telangana' },
  '503': { city: 'Nizamabad', state: 'Telangana' },
  '504': { city: 'Adilabad', state: 'Telangana' },
  '505': { city: 'Karimnagar', state: 'Telangana' },
  '506': { city: 'Warangal', state: 'Telangana' },
  '507': { city: 'Khammam', state: 'Telangana' },
  '508': { city: 'Nalgonda', state: 'Telangana' },

  // Andhra Pradesh
  '515': { city: 'Anantapur', state: 'Andhra Pradesh' },
  '516': { city: 'Kadapa', state: 'Andhra Pradesh' },
  '517': { city: 'Chittoor / Tirupati', state: 'Andhra Pradesh' },
  '518': { city: 'Kurnool', state: 'Andhra Pradesh' },
  '520': { city: 'Vijayawada', state: 'Andhra Pradesh' },
  '521': { city: 'Krishna', state: 'Andhra Pradesh' },
  '522': { city: 'Guntur', state: 'Andhra Pradesh' },
  '523': { city: 'Prakasam / Ongole', state: 'Andhra Pradesh' },
  '524': { city: 'Nellore', state: 'Andhra Pradesh' },
  '530': { city: 'Visakhapatnam', state: 'Andhra Pradesh' },
  '531': { city: 'Anakapalli', state: 'Andhra Pradesh' },
  '532': { city: 'Srikakulam', state: 'Andhra Pradesh' },
  '533': { city: 'Kakinada / East Godavari', state: 'Andhra Pradesh' },
  '534': { city: 'Eluru / West Godavari', state: 'Andhra Pradesh' },
  '535': { city: 'Vizianagaram', state: 'Andhra Pradesh' },

  // Kerala
  '670': { city: 'Kannur', state: 'Kerala' },
  '671': { city: 'Kasaragod', state: 'Kerala' },
  '673': { city: 'Kozhikode', state: 'Kerala' },
  '676': { city: 'Malappuram', state: 'Kerala' },
  '678': { city: 'Palakkad', state: 'Kerala' },
  '680': { city: 'Thrissur', state: 'Kerala' },
  '682': { city: 'Kochi / Ernakulam', state: 'Kerala' },
  '683': { city: 'Aluva / Ernakulam', state: 'Kerala' },
  '685': { city: 'Idukki', state: 'Kerala' },
  '686': { city: 'Kottayam', state: 'Kerala' },
  '688': { city: 'Alappuzha', state: 'Kerala' },
  '689': { city: 'Pathanamthitta', state: 'Kerala' },
  '691': { city: 'Kollam', state: 'Kerala' },
  '695': { city: 'Thiruvananthapuram', state: 'Kerala' },

  // Maharashtra
  '400': { city: 'Mumbai', state: 'Maharashtra' },
  '401': { city: 'Thane / Palghar', state: 'Maharashtra' },
  '411': { city: 'Pune', state: 'Maharashtra' },
  '416': { city: 'Kolhapur', state: 'Maharashtra' },
  '422': { city: 'Nashik', state: 'Maharashtra' },
  '431': { city: 'Chhatrapati Sambhajinagar', state: 'Maharashtra' },
  '440': { city: 'Nagpur', state: 'Maharashtra' },

  // Delhi NCR
  '110': { city: 'New Delhi', state: 'Delhi NCR' },
  '201': { city: 'Noida / Ghaziabad', state: 'Uttar Pradesh' },
  '122': { city: 'Gurugram', state: 'Haryana' },
  '121': { city: 'Faridabad', state: 'Haryana' }
};

export async function lookupPincode(pincode) {
  const clean = String(pincode || '').replace(/\D/g, '').trim();
  if (clean.length !== 6) return null;

  // 1. Try browser PostalPincode API
  try {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 2500);
    const res = await fetch(`https://api.postalpincode.in/pincode/${clean}`, { signal: controller.signal });
    clearTimeout(timer);
    if (res.ok) {
      const data = await res.json();
      if (Array.isArray(data) && data[0]?.Status === 'Success' && data[0]?.PostOffice?.length > 0) {
        const po = data[0].PostOffice[0];
        const rawState = po.State || '';
        let mappedState = rawState;
        if (/tamil/i.test(rawState)) mappedState = 'Tamil Nadu';
        else if (/karnat/i.test(rawState)) mappedState = 'Karnataka';
        else if (/andhra/i.test(rawState)) mappedState = 'Andhra Pradesh';
        else if (/telang/i.test(rawState)) mappedState = 'Telangana';
        else if (/kerala/i.test(rawState)) mappedState = 'Kerala';
        else if (/maharash/i.test(rawState)) mappedState = 'Maharashtra';
        else if (/delhi/i.test(rawState)) mappedState = 'Delhi NCR';

        const city = po.District || po.Division || po.Block || po.Name;
        return {
          city,
          state: mappedState,
          district: po.District,
          postOffice: po.Name,
          source: 'api'
        };
      }
    }
  } catch (e) {
    // Continue to next provider
  }

  // 2. Try Zippopotam API
  try {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 2000);
    const zRes = await fetch(`https://api.zippopotam.us/in/${clean}`, { signal: controller.signal });
    clearTimeout(timer);
    if (zRes.ok) {
      const zData = await zRes.json();
      if (zData.places && zData.places.length > 0) {
        const p = zData.places[0];
        let mappedState = p.state;
        if (/tamil/i.test(mappedState)) mappedState = 'Tamil Nadu';
        else if (/karnat/i.test(mappedState)) mappedState = 'Karnataka';
        else if (/andhra/i.test(mappedState)) mappedState = 'Andhra Pradesh';
        else if (/telang/i.test(mappedState)) mappedState = 'Telangana';
        else if (/kerala/i.test(mappedState)) mappedState = 'Kerala';
        else if (/maharash/i.test(mappedState)) mappedState = 'Maharashtra';
        else if (/delhi/i.test(mappedState)) mappedState = 'Delhi NCR';

        return {
          city: p['place name'],
          state: mappedState,
          district: p['place name'],
          source: 'zippopotam'
        };
      }
    }
  } catch (e) {
    // Continue to offline fallback
  }

  // 3. Fallback to 3-digit prefix lookup (Guaranteed instant result)
  const prefix3 = clean.substring(0, 3);
  if (PINCODE_PREFIX_MAP[prefix3]) {
    const hit = PINCODE_PREFIX_MAP[prefix3];
    return {
      city: hit.city,
      state: hit.state,
      district: hit.city,
      source: 'offline'
    };
  }

  // First-digit general region
  const firstDigit = clean.charAt(0);
  if (firstDigit === '6') {
    return { city: 'Tamil Nadu / Kerala', state: 'Tamil Nadu', source: 'offline-region' };
  } else if (firstDigit === '5') {
    return { city: 'Karnataka / AP', state: 'Karnataka', source: 'offline-region' };
  } else if (firstDigit === '4') {
    return { city: 'Maharashtra', state: 'Maharashtra', source: 'offline-region' };
  }

  return null;
}
