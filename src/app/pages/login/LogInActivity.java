package com.zigzag.plus;

import android.Manifest;
import android.app.Activity;
import android.app.AlertDialog;
import android.bluetooth.BluetoothAdapter;
import android.bluetooth.BluetoothDevice;
import android.bluetooth.BluetoothSocket;
import android.content.ContentValues;
import android.content.Context;
import android.content.DialogInterface;
import android.content.Intent;
import android.content.SharedPreferences;
import android.content.pm.PackageInfo;
import android.content.res.Configuration;
import android.content.res.Resources;
import android.database.Cursor;
import android.database.sqlite.SQLiteConstraintException;
import android.database.sqlite.SQLiteDatabase;
import android.database.sqlite.SQLiteException;
import android.location.Location;
import android.net.ConnectivityManager;
import android.net.NetworkInfo;
import android.os.AsyncTask;
import android.os.Build;
import android.os.Bundle;
import android.util.Base64;
import android.util.Log;
import android.view.KeyEvent;
import android.view.View;
import android.view.Window;
import android.view.WindowManager;
import android.view.View.OnClickListener;
import android.view.inputmethod.EditorInfo;
import android.view.inputmethod.InputMethodManager;
import android.widget.Button;
import android.widget.CheckBox;
import android.widget.EditText;
import android.widget.LinearLayout;
import android.widget.ProgressBar;
import android.widget.TextView;
import android.widget.Toast;

import androidx.annotation.NonNull;

import com.zigzag.plus.activity.ELDActivity;
import com.zigzag.plus.activity.VehicleActivity;
import com.zigzag.plus.models.mLocation;
import com.zigzag.plus.models.mResult;
import com.zigzag.plus.other.DBHelper;
import com.zigzag.plus.other.Utility;
import com.zigzag.plus.service.GpsTracker;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import java.io.BufferedReader;
import java.io.DataOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.io.UnsupportedEncodingException;
import java.net.HttpURLConnection;
import java.net.MalformedURLException;
import java.net.ProtocolException;
import java.net.URL;
import java.nio.charset.StandardCharsets;
import java.text.SimpleDateFormat;
import java.util.Calendar;
import java.util.List;
import java.util.Locale;
import java.util.TimeZone;
import java.util.UUID;

import pub.devrel.easypermissions.AfterPermissionGranted;
import pub.devrel.easypermissions.AppSettingsDialog;
import pub.devrel.easypermissions.EasyPermissions;

import static com.zigzag.plus.other.LocationFinder.getMyLocation;

public class LogInActivity extends Activity implements OnClickListener, EasyPermissions.PermissionCallbacks  {
    private String 	sLanguage 			= "";
    private String 	sUserName           = "";
    private String  sPassword           = "";
    private boolean	bDayNight 			= true;
    private boolean	bPermission		    = false;
    private boolean	bAutomaticLogIn     = true;

    public int       iDataBaseVersion    = 0;

    public final int MY_PERMISSIONS_REQUEST = 99;

    TextView        tvMessageLogIn;

    EditText 	    etUserNameLogIn;
    EditText        etPasswordLogIn;

    LinearLayout    llOffLineMode;
    CheckBox        cbOffLineMode;

    Button          bLogIn;
    TextView        tvForgetPasswordLogIn;

    ProgressBar     pbProgressBarLogIn;
    TextView        tvProgressBarTextLogIn;

    DBHelper        dbHelper;

    MyTask 	   	    myTask;

    Resources       localResources;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        requestWindowFeature(Window.FEATURE_NO_TITLE); //скрываем заголовок
        setContentView(R.layout.activity_login);
        getWindow().addFlags(WindowManager.LayoutParams.FLAG_KEEP_SCREEN_ON); // не блокировать экран

        // Найдем View-элементы
        tvMessageLogIn                          = (TextView)        findViewById(R.id.itvMessageLogIn);

        etUserNameLogIn                         = (EditText)        findViewById(R.id.ietUserNameLogIn);
        etPasswordLogIn                         = (EditText)        findViewById(R.id.ietPasswordLogIn);

        llOffLineMode                           = (LinearLayout)    findViewById(R.id.illOffLineMode);
        cbOffLineMode                           = (CheckBox)        findViewById(R.id.icbOffLineMode);

        bLogIn					                = (Button) 	        findViewById(R.id.ibLogIn);
        tvForgetPasswordLogIn                   = (TextView)        findViewById(R.id.itvForgetPasswordLogIn);

        pbProgressBarLogIn                      = (ProgressBar)     findViewById(R.id.ipbProgressBarLogIn);
        tvProgressBarTextLogIn                  = (TextView)        findViewById(R.id.itvProgressBarTextLogIn);

        // Присваиваем обработчик кнопкам
        bLogIn.setOnClickListener(this);
        tvForgetPasswordLogIn.setOnClickListener(this);

        etPasswordLogIn.setOnEditorActionListener(new TextView.OnEditorActionListener() {
            @Override
            public boolean onEditorAction(TextView v, int actionId, KeyEvent event) {
                boolean handled = false;
                Log.d("JWT_DECODED", "actionId: " + actionId );
                if (actionId == EditorInfo.IME_ACTION_DONE) {
                    LogIn();

                    handled = true;
                }
                return handled;
            }
        });

        // Загрузка данных
        LoadDate();
    }

    private void LoadDate() {
        SharedPreferences myPrefs = getSharedPreferences(getPackageName() + "_preferences", Context.MODE_PRIVATE);
        sLanguage           = myPrefs.getString("sLanguage", "en");
        bDayNight           = myPrefs.getBoolean("day_night", true); // true - day, false - night
        iDataBaseVersion	= myPrefs.getInt("iDataBaseVersion", 0);
        sUserName           = myPrefs.getString("sUserName", "");
        sPassword           = myPrefs.getString("sPassword", "");
        bAutomaticLogIn     = myPrefs.getBoolean("bAutomaticLogIn", true);

        // Язык пользователя
        Resources baseResources = getResources();
        Locale locale = new Locale(sLanguage);
        Locale.setDefault(locale);
        Configuration config = new Configuration();
        config.locale = locale;
        localResources = new Resources(baseResources.getAssets(), baseResources.getDisplayMetrics(), config);

        // создаем объект для создания и управления версиями БД
        dbHelper = new DBHelper(this);

        if(DBHelper.DB_VERSION > iDataBaseVersion)
        {
            try
            {
                dbHelper.copyDataBase();

                myPrefs = getSharedPreferences(getPackageName() + "_preferences", MODE_PRIVATE);
                SharedPreferences.Editor edd = myPrefs.edit();
                edd.putInt("iDataBaseVersion", DBHelper.DB_VERSION);
                edd.commit();
            }
            catch (Exception $e1) {
                //createAndShowDialog("Restart the application", "Updating.");
                return;
            }
        }

        tvMessageLogIn.setVisibility(View.GONE);
        tvMessageLogIn.setText("");

        etUserNameLogIn.setHint(localResources.getString(R.string.username));
        etPasswordLogIn.setHint(localResources.getString(R.string.password));

        llOffLineMode.setVisibility(View.INVISIBLE);

        bLogIn.setText(localResources.getString(R.string.login));

        tvForgetPasswordLogIn.setText(localResources.getString(R.string.forget_password));

        pbProgressBarLogIn.setVisibility(View.GONE);
        tvProgressBarTextLogIn.setVisibility(View.GONE);
        tvProgressBarTextLogIn.setText(localResources.getString(R.string.authenticating));

        etUserNameLogIn.setText(sUserName);
        etPasswordLogIn.setText(sPassword);

        Log.d("JWT_DECODED", "requestCode1: " );

        bPermission = methodRequiresPermission("");

        Log.d("JWT_DECODED", "requestCode2: " );


        if ((!etUserNameLogIn.getText().toString().isEmpty()) &&
            (!etPasswordLogIn.getText().toString().isEmpty())) {
            //etUserNameLogIn.setFocusable(false);
            //etPasswordLogIn.setFocusable(false);
            if ((bAutomaticLogIn == true) &&
               (bPermission == true))
            {
                bLogIn.callOnClick();
            }
        }
    }

    class MyTask extends AsyncTask<Void, String, mResult> {

        LogInActivity activity;

        void link(LogInActivity act)
        {
            activity = act;
            activity.pbProgressBarLogIn.setVisibility(View.VISIBLE);
            activity.tvProgressBarTextLogIn.setVisibility(View.VISIBLE);
        }

        protected void onPreExecute()
        {
            super.onPreExecute();
        }

        protected mResult doInBackground(Void... items) {
            mResult mResult;
            String sCompanyId = "", sDriverId = "", sAssignedVehiclesId = "", sTerminalId = "", sELDId = "", sLogDailiesId = "", sLogHistoriesId = "";
            String sAccessToken = "", sJsonJWT = "", sDriverName = "";
            Boolean bStatus = false;
            SharedPreferences myPrefs = getSharedPreferences(getPackageName() + "_preferences", MODE_PRIVATE);
            SharedPreferences.Editor edd = myPrefs.edit();
            edd.putString("sError", "");
            edd.commit();

            // подключаемся к БД
            SQLiteDatabase db = dbHelper.getWritableDatabase();

            //----------------
            // Authenticating
            //----------------
            JSONObject objAuth = new JSONObject();
            try
            {
                objAuth.put("UserName", activity.etUserNameLogIn.getText().toString());
                objAuth.put("Password", activity.etPasswordLogIn.getText().toString());
                objAuth.put("Project", "ELD");
                try
                {
                    objAuth.put("DeviceModel", Build.MANUFACTURER + " " + Build.MODEL);
                    objAuth.put("OperatingSystem", String.valueOf(Build.VERSION.RELEASE));

                    PackageInfo pInfo = getPackageManager().getPackageInfo(getPackageName(), 0);
                    objAuth.put("AppVersion", pInfo.versionName);
                }
                catch (Exception e) {}
            } catch (JSONException e) { }

            /// "{\"email\":\"" + activity.etUserNameLogIn.getText() + "\",\"password\":\"" + activity.etPasswordLogIn.getText() + "\"}"

            mResult = requestPOST(localResources.getString(R.string.api_url) + "/auth/loginDriver",
                    objAuth.toString() );

            if (mResult.getResultCode() == 0)
            {
                try
                {
                    // Read Access Token
                    JSONObject obj = new JSONObject(mResult.getResultMessage());
                    sAccessToken = obj.getString("AccessToken");

                    edd.putString("sAccessToken", sAccessToken);
                    edd.commit();

                    // Decode JWT - Read NameDriver / DriverID / Status
                    String[] split = sAccessToken.split("\\.");
                    sJsonJWT = JWTUtils.getJson(split[1]);

                    Log.d("JWT_DECODED", "Body: " + sJsonJWT);

                    // Get Status / DriverName / DriverID
                    JSONObject objJWT = new JSONObject(sJsonJWT);
                    bStatus     = objJWT.getBoolean("status");
                    sDriverName = objJWT.getString("name");
                    sDriverId   = objJWT.getString("authUserId");

                    edd.putString("sDriverId", sDriverId);
                    edd.putString("sDriverName", sDriverName);
                    edd.commit();

                    if (bStatus == true)
                    {
                        mResult.setResultCode(0);
                    }
                    else {
                        mResult.setResultCode(-1);
                        mResult.setResultMessage("Status Driver: Inactive");
                    }
                }
                catch (JSONException j)
                {
                    mResult.setResultCode(-1);
                    mResult.setResultMessage("JSON Exception: " + j.getMessage());
                }
                catch (UnsupportedEncodingException u)
                {
                    mResult.setResultCode(-1);
                    mResult.setResultMessage("Unsupported Encoding Exception: " + u.getMessage());
                }
            }

            //----------------
            // Syncing Data
            //----------------
            publishProgress(activity.localResources.getString(R.string.syncing_data));

            //----------------
            // Get Driver
            //----------------
            if (mResult.getResultCode() == 0)
            {
                mResult = requestGET(localResources.getString(R.string.api_url) + "/eldManage/driver",
                        "?DriverId=" + sDriverId );

                if (mResult.getResultCode() == 0)
                {
                    try
                    {
                        ContentValues cv = new ContentValues();

                        JSONObject obj = new JSONObject(mResult.getResultMessage());

                        cv.clear();
                        cv.put("driver_id", obj.getString("DriverId"));
                        cv.put("company_id", obj.getString("CompanyId"));
                        cv.put("name", obj.getString("Name"));
                        cv.put("email", obj.getString("Email"));
                        cv.put("user_name", obj.getString("UserName"));
                        cv.put("driver_identifier", obj.getString("DriverIdentifier"));
                        cv.put("phone_number", obj.getString("PhoneNumber"));
                        cv.put("state_province_code", obj.getString("StateProvinceCode"));
                        cv.put("license_number", obj.getString("LicenseNumber"));
                        cv.put("home_terminal_id", obj.getString("HomeTerminalId"));
                        cv.put("assigned_vehicles_id", obj.getString("AssignedVehiclesId"));
                        cv.put("hours_of_service_rule", obj.getString("HoursOfServiceRuleName"));
                        cv.put("hours_of_service_rule_days", obj.getInt("HoursOfServiceRuleDays"));
                        cv.put("hours_of_service_rule_hours", obj.getInt("HoursOfServiceRuleHours"));
                        cv.put("cargo_type", obj.getString("CargoTypeName"));
                        cv.put("restart_hours", obj.getString("RestartHoursName"));
                        cv.put("rest_break", obj.getString("RestBreakName"));
                        cv.put("short_haul_exception", obj.getBoolean("ShortHaulException"));
                        cv.put("allow_yard_moves", obj.getBoolean("AllowYardMoves"));
                        cv.put("allow_personal_use", obj.getBoolean("AllowPersonalUse"));
                        cv.put("unlimited_trailers", 0);
                        cv.put("unlimited_ship_doc", 0);

                        // View exist driver
                        int r = db.update("driver", cv, "driver_id = '" + sDriverId + "' ", null);
                        if (r == 0)
                        {
                            db.insert("driver", null, cv);
                        }

                        sCompanyId = obj.getString("CompanyId");
                        sAssignedVehiclesId = obj.getString("AssignedVehiclesId");
                        edd.putString("sCompanyId", sCompanyId);
                        edd.commit();

                    }
                    catch (JSONException j)
                    {
                        mResult.setResultCode(-1);
                        mResult.setResultMessage("JSON Exception: " + j.getMessage());
                    }
                    catch (SQLiteConstraintException s)
                    {
                        mResult.setResultCode(-1);
                        mResult.setResultMessage("SQLite Constraint Exception: " + s.getMessage());
                    }
                    catch (SQLiteException  s)
                    {
                        s.printStackTrace();
                        mResult.setResultCode(-1);
                        mResult.setResultMessage("SQLite Exception: " + s.getMessage());
                    }
                    catch (Exception e)
                    {
                        mResult.setResultCode(-1);
                        mResult.setResultMessage("Exception: " + e.getMessage());
                    }
                }
            }

            //----------------
            // Get Company
            //----------------
            if (mResult.getResultCode() == 0)
            {
                mResult = requestGET(localResources.getString(R.string.api_url) + "/eldManage/company",
                        "");

                if (mResult.getResultCode() == 0)
                {
                    try
                    {
                        ContentValues cv = new ContentValues();

                        JSONObject obj = new JSONObject(mResult.getResultMessage());

                        cv.clear();
                        cv.put("company_id", obj.getString("CompanyId"));
                        cv.put("name", obj.getString("Name"));
                        cv.put("dot_number", obj.getString("DotNumber"));
                        cv.put("street", obj.getString("Street"));
                        cv.put("city", obj.getString("City"));
                        cv.put("country_code", obj.getString("CountryCode"));
                        cv.put("state_province_code", obj.getString("StateProvinceCode"));
                        cv.put("zip_code", obj.getString("ZipCode"));
                        cv.put("time_zone_code", obj.getString("TimeZoneCode"));
                        cv.put("time_zone_city", obj.getString("TimeZoneCity"));

                        edd.putString("sTimeZoneCity", obj.getString("TimeZoneCity"));
                        edd.commit();

                        if (sCompanyId.compareTo(obj.getString("CompanyId")) == 0)
                        {
                            // View exist company
                            int r = db.update("company", cv, "company_id = '" + sCompanyId + "' ", null);
                            if (r == 0) {
                                db.insert("company", null, cv);
                            }
                        }
                    }
                    catch (JSONException j)
                    {
                        mResult.setResultCode(-1);
                        mResult.setResultMessage("JSON Exception: " + j.getMessage());
                    }
                    catch (SQLiteConstraintException s)
                    {
                        mResult.setResultCode(-1);
                        mResult.setResultMessage("SQLite Constraint Exception: " + s.getMessage());
                    }
                    catch (SQLiteException s)
                    {
                        s.printStackTrace();
                        mResult.setResultCode(-1);
                        mResult.setResultMessage("SQLite Exception: " + s.getMessage());
                    }
                    catch (Exception e)
                    {
                        mResult.setResultCode(-1);
                        mResult.setResultMessage("Exception: " + e.getMessage());
                    }
                }
            }

            //----------------
            // Get Vehicle
            //----------------
            if (mResult.getResultCode() == 0)
            {
                mResult = requestGET(localResources.getString(R.string.api_url) + "/eldManage/vehicles",
                        "?CompanyId=" + sCompanyId );

                if (mResult.getResultCode() == 0)
                {
                    try
                    {
                        ContentValues cv = new ContentValues();

                        JSONArray jTerminals = new JSONArray(mResult.getResultMessage());

                        for (int i = 0; i < jTerminals.length(); i++) {
                            JSONObject obj = jTerminals.getJSONObject(i);

                            cv.clear();
                            cv.put("vehicle_id", obj.getString("VehicleId"));
                            cv.put("company_id", obj.getString("CompanyId"));
                            cv.put("vehicle_unit", obj.getString("VehicleUnit"));
                            cv.put("vin", obj.getString("VIN"));
                            cv.put("make", obj.getString("Make"));
                            cv.put("model", obj.getString("Model"));
                            cv.put("year", obj.getString("Year"));

                            if (sAssignedVehiclesId.compareTo(obj.getString("VehicleId")) == 0) {
                                // View exist company
                                int r = db.update("vehicles", cv, "vehicle_id = '" + sAssignedVehiclesId + "' ", null);
                                if (r == 0) {
                                    db.insert("vehicles", null, cv);
                                }
                            }
                        }
                    }
                    catch (JSONException j)
                    {
                        mResult.setResultCode(-1);
                        mResult.setResultMessage("JSON Exception: " + j.getMessage());
                    }
                    catch (SQLiteConstraintException s)
                    {
                        mResult.setResultCode(-1);
                        mResult.setResultMessage("SQLite Constraint Exception: " + s.getMessage());
                    }
                    catch (SQLiteException s)
                    {
                        s.printStackTrace();
                        mResult.setResultCode(-1);
                        mResult.setResultMessage("SQLite Exception: " + s.getMessage());
                    }
                    catch (Exception e)
                    {
                        mResult.setResultCode(-1);
                        mResult.setResultMessage("Exception: " + e.getMessage());
                    }
                }
            }

            //----------------
            // Get Terminals
            //----------------
            if (mResult.getResultCode() == 0)
            {
                mResult = requestGET(localResources.getString(R.string.api_url) + "/eldManage/terminals",
                        "?CompanyId=" + sCompanyId );

                if (mResult.getResultCode() == 0)
                {
                    try
                    {
                        ContentValues cv = new ContentValues();

                        JSONArray jTerminals = new JSONArray(mResult.getResultMessage());

                        for (int i = 0; i < jTerminals.length(); i++) {
                            JSONObject obj = jTerminals.getJSONObject(i);

                            sTerminalId = obj.getString("TerminalId");

                            cv.clear();
                            cv.put("terminal_id", obj.getString("TerminalId"));
                            cv.put("company_id", obj.getString("CompanyId"));
                            cv.put("time_zone_code", obj.getString("TimeZoneCode"));
                            cv.put("street", obj.getString("Street"));
                            cv.put("city", obj.getString("City"));
                            cv.put("country_code", obj.getString("CountryCode"));
                            cv.put("state_province_code", obj.getString("StateProvinceCode"));
                            cv.put("zip_code", obj.getString("ZipCode"));

                            // View exist company
                            int r = db.update("terminal", cv, "terminal_id = '" + sTerminalId + "' ", null);
                            if (r == 0) {
                                db.insert("terminal", null, cv);
                            }
                        }
                    }
                    catch (JSONException j)
                    {
                        mResult.setResultCode(-1);
                        mResult.setResultMessage("JSON Exception: " + j.getMessage());
                    }
                    catch (SQLiteConstraintException s)
                    {
                        mResult.setResultCode(-1);
                        mResult.setResultMessage("SQLite Constraint Exception: " + s.getMessage());
                    }
                    catch (SQLiteException s)
                    {
                        s.printStackTrace();
                        mResult.setResultCode(-1);
                        mResult.setResultMessage("SQLite Exception: " + s.getMessage());
                    }
                    catch (Exception e)
                    {
                        mResult.setResultCode(-1);
                        mResult.setResultMessage("Exception: " + e.getMessage());
                    }
                }
            }

            //----------------
            // Get ELDs
            //----------------
            if (mResult.getResultCode() == 0)
            {
                mResult = requestGET(localResources.getString(R.string.api_url) + "/eldManage/elds",
                        "?CompanyId=" + sCompanyId );

                if (mResult.getResultCode() == 0)
                {
                    try
                    {
                        ContentValues cv = new ContentValues();

                        JSONArray jELDs = new JSONArray(mResult.getResultMessage());

                        for (int i = 0; i < jELDs.length(); i++) {
                            JSONObject obj = jELDs.getJSONObject(i);

                            sELDId = obj.getString("ELDId");

                            cv.clear();
                            cv.put("eld_name", "");
                            cv.put("eld_id", obj.getString("ELDId"));
                            cv.put("company_id", obj.getString("CompanyId"));
                            cv.put("mac_address", obj.getString("MACAddress"));
                            cv.put("type", obj.getString("Type"));
                            cv.put("vehicle_id", obj.getString("VehicleId"));
                            cv.put("fw_version", obj.getString("FWVersion"));
                            cv.put("uuid", "");
                            cv.put("upload", 1);

                            // View exist company
                            int r = db.update("eld", cv, "eld_id = '" + sELDId + "' ", null);
                            if (r == 0) {
                                long rI = db.insert("eld", null, cv);
                                Log.d("JWT_DECODED", "Insert:" + rI);
                            }
                        }
                    }
                    catch (JSONException j)
                    {
                        mResult.setResultCode(-1);
                        mResult.setResultMessage("JSON Exception: " + j.getMessage());
                    }
                    catch (SQLiteConstraintException s)
                    {
                        mResult.setResultCode(-1);
                        mResult.setResultMessage("SQLite Constraint Exception: " + s.getMessage());
                    }
                    catch (SQLiteException s)
                    {
                        s.printStackTrace();
                        mResult.setResultCode(-1);
                        mResult.setResultMessage("SQLite Exception: " + s.getMessage());
                    }
                    catch (Exception e)
                    {
                        mResult.setResultCode(-1);
                        mResult.setResultMessage("Exception: " + e.getMessage());
                    }
                }
            }

            //----------------
            // Get LogDailies
            //----------------
            if (mResult.getResultCode() == 0)
            {
                // Текущие время
                Calendar cCalendar = Calendar.getInstance();
                SimpleDateFormat dfIn = new SimpleDateFormat("yyyy-MM-dd");
                String sDateCurrent = dfIn.format(cCalendar.getTime().getTime());

                mResult = requestGET(localResources.getString(R.string.api_url) + "/eldDashboard/logDailies",
                        "?GeneralId=" + sDriverId + "&LogDate=" + sDateCurrent + "&CountDay=15");

                if (mResult.getResultCode() == 0)
                {
                    try
                    {
                        ContentValues cv = new ContentValues();

                        JSONArray jDriverStatuses = new JSONArray(mResult.getResultMessage());

                        for (int i = 0; i < jDriverStatuses.length(); i++) {
                            JSONObject obj = jDriverStatuses.getJSONObject(i);

                            sLogDailiesId = obj.getString("LogDailiesId");

                            cv.clear();
                            cv.put("company_id", obj.getString("CompanyId"));
                            cv.put("driver_id", obj.getString("DriverId"));
                            cv.put("vehicle_id", obj.getString("VehicleId"));
                            cv.put("log_dailies_id", obj.getString("LogDailiesId"));
                            cv.put("day", obj.getString("Day"));
                            cv.put("hours_off_duty", obj.getInt("HoursOffDuty"));
                            cv.put("hours_sleeper", obj.getInt("HoursSleeper"));
                            cv.put("hours_driving", obj.getInt("HoursDriving"));
                            cv.put("hours_on_duty", obj.getInt("HoursOnDuty"));
                            cv.put("hours_worked", obj.getInt("HoursWorked"));
                            cv.put("violations", obj.getString("Violations"));
                            cv.put("form_manner", obj.getBoolean("FormManner"));
                            cv.put("trailers", obj.getString("Trailers"));
                            cv.put("shipping_doc", obj.getString("ShippingDoc"));
                            cv.put("from_address", obj.getString("FromAddress"));
                            cv.put("to_address", obj.getString("ToAddress"));
                            cv.put("certified", obj.getBoolean("Certified"));

                            if (obj.getString("CertifyTimestamp").compareTo("0001-01-01T00:00:00") == 0)
                            { }
                            else
                            {
                                cv.put("certify_timestamp", obj.getString("CertifyTimestamp"));
                            }

                            cv.put("signature", obj.getString("Signature"));
                            cv.put("upload", 1);

                            Log.d("JWT_DECODED", "load Day: " + obj.getString("Day"));

                            // View exist Log Dailies
                            int r = db.update("log_dailies", cv, "log_dailies_id = '" + sLogDailiesId + "' ", null);
                            if (r == 0) {
                                db.insert("log_dailies", null, cv);
                            }
                        }
                    }
                    catch (JSONException j)
                    {
                        mResult.setResultCode(-1);
                        mResult.setResultMessage("JSON Exception: " + j.getMessage());
                    }
                    catch (SQLiteConstraintException s)
                    {
                        mResult.setResultCode(-1);
                        mResult.setResultMessage("SQLite Constraint Exception: " + s.getMessage());
                    }
                    catch (SQLiteException s)
                    {
                        s.printStackTrace();
                        mResult.setResultCode(-1);
                        mResult.setResultMessage("SQLite Exception: " + s.getMessage());
                    }
                    catch (Exception e)
                    {
                        mResult.setResultCode(-1);
                        mResult.setResultMessage("Exception: " + e.getMessage());
                    }
                }
            }

            //-------------------------
            // Get LogHistories14Days
            //-------------------------
            if (mResult.getResultCode() == 0)
            {
                mResult = requestGET(localResources.getString(R.string.api_url) + "/eldDashboard/LogHistories14Days",
                        "?DriverId=" + sDriverId);

                if (mResult.getResultCode() == 0)
                {
                    try
                    {
                        ContentValues cv = new ContentValues();

                        // Обнуляем выгрузку на сервер
                        cv.clear();
                        cv.put("upload", 0);
                        db.update("log_histories", cv, "", null);

                        JSONArray jDriverStatuses = new JSONArray(mResult.getResultMessage());

                        for (int i = 0; i < jDriverStatuses.length(); i++) {
                            JSONObject obj = jDriverStatuses.getJSONObject(i);

                            sLogHistoriesId = obj.getString("LogHistoriesId");

                            cv.clear();
                            cv.put("log_histories_id", obj.getString("LogHistoriesId"));
                            cv.put("log_dailies_id", obj.getString("LogDailiesId"));
                            cv.put("driver_id", obj.getString("DriverId"));
                            cv.put("co_driver_id", obj.getString("CoDriverId"));
                            cv.put("vehicle_id", obj.getString("VehicleId"));
                            cv.put("eld_id", obj.getString("ELDId"));
                            cv.put("date_bgn", obj.getString("DateBgn"));

                            if (obj.getString("DateEnd").compareTo("0001-01-01T00:00:00") == 0)
                            {
                                cv.put("upload", 0);
                            }
                            else
                            {
                                cv.put("date_end", obj.getString("DateEnd"));
                                cv.put("upload", 1);
                            }

                            cv.put("event_sequence_number", obj.getInt("EventSequenceNumber"));
                            cv.put("event_type_code", obj.getString("EventTypeCode"));
                            cv.put("event_type_name", obj.getString("EventTypeName"));
                            cv.put("country_code", obj.getString("CountryCode"));
                            cv.put("state_province_code", obj.getString("StateProvinceCode"));
                            cv.put("city", obj.getString("City"));
                            cv.put("event_record_status_code", obj.getString("EventRecordStatusCode"));
                            cv.put("event_record_status_name", obj.getString("EventRecordStatusName"));
                            cv.put("event_record_origin_code", obj.getString("EventRecordOriginCode"));
                            cv.put("event_record_origin_name", obj.getString("EventRecordOriginName"));
                            cv.put("odometer", obj.getInt("Odometer"));
                            cv.put("hours_engine", obj.getInt("EngineHours"));
                            cv.put("latitude", obj.getDouble("Latitude"));
                            cv.put("longitude", obj.getDouble("Longitude"));
                            cv.put("distance_since", obj.getInt("DistanceSince"));
                            cv.put("malfunction", obj.getBoolean("Malfunction"));
                            cv.put("data_diagnostic_event", obj.getBoolean("DataDiagnosticEvent"));
                            cv.put("location_description", obj.getString("LocationDescription"));
                            cv.put("comment", obj.getString("Comment"));
                            cv.put("event_data_check", obj.getString("EventDataCheck"));
                            cv.put("positioning_code", obj.getString("PositioningCode"));
                            cv.put("positioning_name", obj.getString("PositioningName"));
                            cv.put("location_source_code", obj.getString("LocationSourceCode"));
                            cv.put("location_source_name", obj.getString("LocationSourceName"));
                            cv.put("send_log_to_inspector", obj.getBoolean("SendLogToInspector"));

                            // View exist Log Dailies
                            int r = db.update("log_histories", cv, "log_histories_id = '" + sLogHistoriesId + "' ", null);
                            if (r == 0) {
                                db.insert("log_histories", null, cv);
                            }
                        }
                    }
                    catch (JSONException j)
                    {
                        mResult.setResultCode(-1);
                        mResult.setResultMessage("JSON Exception: " + j.getMessage());
                    }
                    catch (SQLiteConstraintException s)
                    {
                        mResult.setResultCode(-1);
                        mResult.setResultMessage("SQLite Constraint Exception: " + s.getMessage());
                    }
                    catch (SQLiteException s)
                    {
                        s.printStackTrace();
                        mResult.setResultCode(-1);
                        mResult.setResultMessage("SQLite Exception: " + s.getMessage());
                    }
                    catch (Exception e)
                    {
                        mResult.setResultCode(-1);
                        mResult.setResultMessage("Exception: " + e.getMessage());
                    }
                }
            }

            db.close();

            return mResult;
        }

        protected void onProgressUpdate(String... items) {
            super.onProgressUpdate(items);
            activity.tvProgressBarTextLogIn.setText(items[0]);
        }

        protected void onPostExecute(mResult mResult) {
            super.onPostExecute(mResult);
            activity.myTask = null;
            activity.pbProgressBarLogIn.setVisibility(View.GONE);
            activity.tvProgressBarTextLogIn.setVisibility(View.GONE);

            if ((mResult.getResultCode() == 0) || (cbOffLineMode.isChecked()))
            {
                SharedPreferences myPrefs = getSharedPreferences(getPackageName() + "_preferences", MODE_PRIVATE);
                String  sSelectedVehicleId  = myPrefs.getString("sSelectedVehicleId", "");

                SharedPreferences.Editor edd = myPrefs.edit();
                edd.putString("sUserName", activity.etUserNameLogIn.getText().toString());
                edd.putString("sPassword", activity.etPasswordLogIn.getText().toString());
                edd.putBoolean("bAutomaticLogIn", true);
                edd.commit();

                Intent intent = new Intent();
                if (sSelectedVehicleId.trim().length() > 0)
                {
                    edd.putString("sIntentELD", "LogInActivity");
                    edd.commit();

                    intent.setClass(LogInActivity.this, ELDActivity.class);
                    startActivity(intent);
                }
                else
                {
                    edd.putString("sIntentVehicle", "LogInActivity");
                    edd.commit();

                    intent.setClass(LogInActivity.this, VehicleActivity.class);
                    startActivity(intent);
                }

                finish();
                overridePendingTransition(R.anim.slide_left_in, R.anim.slide_left_out);
            }
            else
            {
                if ((!etUserNameLogIn.getText().toString().isEmpty()) &&
                        (!etPasswordLogIn.getText().toString().isEmpty()))
                {
                    llOffLineMode.setVisibility(View.VISIBLE);
                }
                else
                {
                    llOffLineMode.setVisibility(View.INVISIBLE);
                }

                tvMessageLogIn.setVisibility(View.VISIBLE);
                tvMessageLogIn.setText(mResult.getResultMessage());
                tvMessageLogIn.setBackgroundColor(getResources().getColor(R.color.cRed));
            }
        }
    }

    public mResult requestPOST(String sURL, String sBody)
    {
        int iResultCode;
        String sResultMessage;

        HttpURLConnection connectionAuth = null;
        try
        {
            // Created URL for connection.
            URL urlAuth = new URL(sURL);

            String requestAuth = sBody;

            // Input data setup
            byte[] postDataAuth = requestAuth.getBytes(StandardCharsets.UTF_8);
            int postDataLengthAuth = postDataAuth.length;

            // Created connection
            connectionAuth = (HttpURLConnection) urlAuth.openConnection();
            connectionAuth.setDoOutput(true);
            connectionAuth.setInstanceFollowRedirects(false);
            connectionAuth.setRequestMethod("POST");
            connectionAuth.setRequestProperty("Content-Type", "application/json");
            connectionAuth.setRequestProperty("charset", "utf-8");
            connectionAuth.setRequestProperty("Content-Length", Integer.toString(postDataLengthAuth));
            connectionAuth.setUseCaches(false);

            // Loaded inputs
            DataOutputStream wrAuth = new DataOutputStream(connectionAuth.getOutputStream());
            wrAuth.write(postDataAuth);
            wrAuth.flush();
            wrAuth.close();

            // Getting a response
            int responseCodeAuth = connectionAuth.getResponseCode();
            if (responseCodeAuth == HttpURLConnection.HTTP_OK) {
                // Read response
                iResultCode = 0;
                sResultMessage = convertStreamToString(connectionAuth.getInputStream());
            }
            else
            {
                // Read Error
                iResultCode = -1;
                sResultMessage = "API: " + sURL + " - " + connectionAuth.getResponseMessage();
            }
        }
        catch (MalformedURLException m)
        {
            iResultCode = -1;
            sResultMessage = "Malformed URL Exception: " + m.getMessage();
        }
        catch (ProtocolException p)
        {
            iResultCode = -1;
            sResultMessage = "Protocol Exception: " + p.getMessage();
        }
        catch (IOException i)
        {
            iResultCode = -1;
            sResultMessage = "IO Exception: " + i.getMessage();
        }
        catch (Exception e)
        {
            iResultCode = -1;
            sResultMessage = "Exception: " + e.getMessage();
        }
        finally
        {
            if(connectionAuth != null)
            {
                connectionAuth.disconnect();
            }
        }

        return new mResult(iResultCode, sResultMessage);
    }

    public mResult requestGET(String sURL, String sParam)
    {
        int iResultCode;
        String sResultMessage, sAccessToken;

        HttpURLConnection connectionSync = null;
        try
        {
            SharedPreferences myPrefs = getSharedPreferences(getPackageName() + "_preferences", Context.MODE_PRIVATE);
            sAccessToken              = myPrefs.getString("sAccessToken", "en");

            // Created URL for connection.
            URL urlSync = new URL(sURL + sParam);

            // Created connection
            connectionSync = (HttpURLConnection) urlSync.openConnection();
            connectionSync.setDoInput(true);
            connectionSync.setDoOutput(false);
            connectionSync.setInstanceFollowRedirects(false);
            connectionSync.setRequestMethod("GET");
            connectionSync.setRequestProperty("Authorization","Bearer " + sAccessToken);
            connectionSync.setRequestProperty("Content-Type", "application/json");
            connectionSync.setRequestProperty("charset", "utf-8");
            connectionSync.setUseCaches(false);

            // Getting a response
            int responseCodeSync = connectionSync.getResponseCode();
            if (responseCodeSync == HttpURLConnection.HTTP_OK)
            {
                // Read response
                iResultCode = 0;
                sResultMessage = convertStreamToString(connectionSync.getInputStream());

                Log.d("JWT_DECODED", "sResultMessage: " + sResultMessage);
            }
            else
            {
                // Read Error
                iResultCode = -1;
                sResultMessage = "API: " + sURL + " - " + connectionSync.getResponseMessage();
            }
        }
        catch (MalformedURLException m)
        {
            iResultCode = -1;
            sResultMessage = "Malformed URL Exception: " + m.getMessage();
        }
        catch (ProtocolException p)
        {
            iResultCode = -1;
            sResultMessage = "Protocol Exception: " + p.getMessage();
        }
        catch (IOException i)
        {
            iResultCode = -1;
            sResultMessage = "IO Exception: " + i.getMessage();
        }
        catch (Exception e)
        {
            iResultCode = -1;
            sResultMessage = "Exception: " + e.getMessage();
        }
        finally
        {
            if(connectionSync != null)
            {
                connectionSync.disconnect();
            }
        }

        return new mResult(iResultCode, sResultMessage);
    }


    private static String convertStreamToString(InputStream is) {

        BufferedReader reader = new BufferedReader(new InputStreamReader(is));
        StringBuilder sb = new StringBuilder();

        String line = null;
        try
        {
            while ((line = reader.readLine()) != null)
            {
                sb.append(line + "\n");
            }
        }
        catch (IOException e)
        {
            e.printStackTrace();
        }
        finally
        {
            try
            {
                is.close();
            }
            catch (IOException e)
            {
                e.printStackTrace();
            }
        }
        return sb.toString();

    }

    public static class JWTUtils
    {
        private static String getJson(String strEncoded) throws UnsupportedEncodingException
        {
            byte[] decodedBytes = Base64.decode(strEncoded, Base64.URL_SAFE);
            return new String(decodedBytes, "UTF-8");
        }
    }

    private void LogIn()
    {
        //Hide keyboard after enter
        try
        {
            View view = this.getCurrentFocus();
            if (view != null)
            {
                InputMethodManager imm = (InputMethodManager) getSystemService(Context.INPUT_METHOD_SERVICE);
                imm.hideSoftInputFromWindow(view.getWindowToken(), 0);
            }
        }
        catch (Exception e)
        {}

        // Check
        if (etUserNameLogIn.getText().toString().isEmpty())
        {
            tvMessageLogIn.setVisibility(View.VISIBLE);
            tvMessageLogIn.setText(localResources.getString(R.string.username_can_not_be_empty));
            tvMessageLogIn.setBackgroundColor(getResources().getColor(R.color.cRed));

            etUserNameLogIn.setHintTextColor(getResources().getColor(R.color.cRed));
        }
        else if(etPasswordLogIn.getText().toString().isEmpty())
        {
            tvMessageLogIn.setVisibility(View.VISIBLE);
            tvMessageLogIn.setText(localResources.getString(R.string.password_can_not_be_empty));
            tvMessageLogIn.setBackgroundColor(getResources().getColor(R.color.cRed));

            etUserNameLogIn.setHintTextColor(getResources().getColor(R.color.cWhite));
            etPasswordLogIn.setHintTextColor(getResources().getColor(R.color.cRed));
        }

        if ((!etUserNameLogIn.getText().toString().isEmpty()) &&
                (!etPasswordLogIn.getText().toString().isEmpty()) )
        {
            if (methodRequiresPermission(""))
            {
                etUserNameLogIn.setHintTextColor(getResources().getColor(R.color.cWhite));
                etPasswordLogIn.setHintTextColor(getResources().getColor(R.color.cWhite));

                //Проверка подключения к интернету
                //Функция для проверки связи с Интернетом
                ConnectivityManager cm = (ConnectivityManager) getSystemService(Context.CONNECTIVITY_SERVICE);
                NetworkInfo nInfo = cm.getActiveNetworkInfo();
                if (nInfo != null && nInfo.isConnected())
                {
                    tvMessageLogIn.setVisibility(View.GONE);
                    tvMessageLogIn.setText("");

                    if (myTask != null)
                    {
                        pbProgressBarLogIn.setVisibility(View.VISIBLE);
                    }
                    else
                    {
                        myTask = new MyTask();
                        myTask.execute();
                    }
                    myTask.link(this);

                }
                else
                {
                    tvMessageLogIn.setVisibility(View.VISIBLE);
                    tvMessageLogIn.setText(localResources.getString(R.string.no_internet_connection));
                    tvMessageLogIn.setBackgroundColor(getResources().getColor(R.color.cRed));
                }
            }
        }
    }

    public void onClick(View v)
    {
        // по id определеяем кнопку, вызвавшую этот обработчик
        switch (v.getId()) {
            case R.id.ibLogIn:
                LogIn();

                break;

            case R.id.itvForgetPasswordLogIn:
                Intent intent = new Intent();
                intent.setClass(this, ForgetPasswordActivity.class);
                startActivity(intent);

                overridePendingTransition(R.anim.slide_left_in, R.anim.slide_left_out);
                break;
        }

    }

    public void onPause() {
        super.onPause();
    }

    //@AfterPermissionGranted(MY_PERMISSIONS_REQUEST)
    private boolean methodRequiresPermission(String sTypeRequest)
    {
        String[] perms = {Manifest.permission.ACCESS_FINE_LOCATION, Manifest.permission.ACCESS_COARSE_LOCATION};
        if (sTypeRequest.compareTo("GSP") == 0)
        {
            perms = new String[]{Manifest.permission.ACCESS_FINE_LOCATION, Manifest.permission.ACCESS_COARSE_LOCATION};
        }
        else if (sTypeRequest.compareTo("BLUETOOTH") == 0)
        {
            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.S)
            {
                perms = new String[]{Manifest.permission.BLUETOOTH_SCAN, Manifest.permission.BLUETOOTH_CONNECT};
            }
        }
        else
        {
            perms = new String[]{Manifest.permission.ACCESS_FINE_LOCATION, Manifest.permission.ACCESS_COARSE_LOCATION};

            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.S)
            {
                perms = new String[]{Manifest.permission.ACCESS_FINE_LOCATION, Manifest.permission.ACCESS_COARSE_LOCATION,
                                     Manifest.permission.BLUETOOTH_SCAN, Manifest.permission.BLUETOOTH_CONNECT};
            }
        }

        if (EasyPermissions.hasPermissions(this, perms))
        {
            return true;
        }
        else
        {
            String sPermissions;
            if (sTypeRequest.compareTo("GSP") == 0)
            {
                sPermissions = localResources.getString(R.string.we_need_location_permission);
            }
            else if (sTypeRequest.compareTo("BLUETOOTH") == 0)
            {
                sPermissions = localResources.getString(R.string.we_need_bluetooth_permission);
            }
            else
            {
                sPermissions = localResources.getString(R.string.we_need_location_bluetooth_permission);
            }

            EasyPermissions.requestPermissions(this, sPermissions, MY_PERMISSIONS_REQUEST, perms);
            return false;
        }
    }

    public void onRequestPermissionsResult(int requestCode, @NonNull String[] permissions, @NonNull int[] grantResults) {
        super.onRequestPermissionsResult(requestCode, permissions, grantResults);
         EasyPermissions.onRequestPermissionsResult(requestCode, permissions, grantResults, this);
    }

    public void onPermissionsGranted(int requestCode, @NonNull List<String> perms) {
        Log.d("JWT_DECODED", "onPermissionsGranted requestCode: " + requestCode);
    }

    public void onPermissionsDenied(int requestCode, @NonNull List<String> perms) {
        Log.d("JWT_DECODED", "onPermissionsDenied requestCode: " + perms );

        if (EasyPermissions.somePermissionPermanentlyDenied(this, perms)) {
            new AppSettingsDialog.Builder(this).build().show();

        }
    }

    protected void onActivityResult(int requestCode, int resultCode, Intent data) {
        super.onActivityResult(requestCode, resultCode, data);
        if (requestCode == AppSettingsDialog.DEFAULT_SETTINGS_REQ_CODE) {
        }
    }
}