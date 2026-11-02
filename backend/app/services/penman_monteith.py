import math

def calculate_fao56_penman_monteith(
    temp_c: float,
    humidity_percent: float,
    wind_speed_ms: float = 3.2,
    solar_radiation_mj: float = 18.5,
    altitude_m: float = 5.0
) -> float:
    """
    Kalkulasi laju evapotranspirasi fisik standar FAO-56 Penman-Monteith (mm/hari).
    Formula:
        ET0 = [0.408 * Delta * (Rn - G) + gamma * (900 / (T + 273)) * u2 * (es - ea)] / [Delta + gamma * (1 + 0.34 * u2)]
    """
    # Tekanan atmosfer (kPa) berdasarkan ketinggian pesisir (Pamekasan ~5 mdpl)
    P = 101.3 * math.pow((293.0 - 0.0065 * altitude_m) / 293.0, 5.26)
    
    # Konstanta psikrometrik gamma (kPa/°C)
    gamma = 0.000665 * P
    
    # Tekanan uap jenuh es (kPa)
    es = 0.6108 * math.exp((17.27 * temp_c) / (temp_c + 237.3))
    
    # Tekanan uap aktual ea (kPa)
    ea = es * (max(1.0, min(100.0, humidity_percent)) / 100.0)
    
    # Kemiringan kurva tekanan uap jenuh Delta (kPa/°C)
    delta = (4098.0 * es) / math.pow(temp_c + 237.3, 2)
    
    # Fluks panas tanah G untuk resolusi harian mendekati nol
    G = 0.0
    Rn = max(0.0, solar_radiation_mj)
    u2 = max(0.1, wind_speed_ms)
    
    # Pembilang dan Penyebut formula FAO-56
    numerator = (0.408 * delta * (Rn - G)) + (gamma * (900.0 / (temp_c + 273.0)) * u2 * (es - ea))
    denominator = delta + (gamma * (1.0 + 0.34 * u2))
    
    et0 = numerator / denominator if denominator != 0 else 3.5
    return round(max(0.5, et0), 2)

