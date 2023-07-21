package com.zigzag.plus.fragment;

import android.Manifest;
import android.annotation.SuppressLint;
import android.app.AlertDialog;
import android.bluetooth.BluetoothAdapter;
import android.bluetooth.BluetoothDevice;
import android.bluetooth.BluetoothManager;
import android.bluetooth.BluetoothSocket;
import android.content.ContentValues;
import android.content.Context;
import android.content.DialogInterface;
import android.content.Intent;
import android.content.IntentSender;
import android.content.SharedPreferences;
import android.content.pm.PackageManager;
import android.content.res.Configuration;
import android.content.res.Resources;
import android.database.Cursor;
import android.database.sqlite.SQLiteDatabase;
import android.location.Location;
import android.location.LocationListener;
import android.location.LocationManager;
import android.net.ConnectivityManager;
import android.net.NetworkInfo;
import android.os.AsyncTask;
import android.os.Build;
import android.os.Bundle;
import android.os.Handler;
import android.util.DisplayMetrics;
import android.util.Log;
import android.view.GestureDetector;
import android.view.LayoutInflater;
import android.view.MotionEvent;
import android.view.View;
import android.view.ViewGroup;
import android.widget.Button;
import android.widget.ImageButton;
import android.widget.LinearLayout;
import android.widget.ProgressBar;
import android.widget.Switch;
import android.widget.TextView;
import android.widget.Toast;

import androidx.core.app.ActivityCompat;
import androidx.fragment.app.Fragment;
import androidx.recyclerview.widget.LinearLayoutManager;
import androidx.recyclerview.widget.RecyclerView;

import com.github.pires.obd.commands.SpeedCommand;
import com.github.pires.obd.commands.control.DistanceMILOnCommand;
import com.github.pires.obd.commands.control.DistanceSinceCCCommand;
import com.github.pires.obd.commands.control.VinCommand;
import com.github.pires.obd.commands.engine.LoadCommand;
import com.github.pires.obd.commands.engine.RuntimeCommand;
import com.github.pires.obd.commands.protocol.EchoOffCommand;
import com.github.pires.obd.commands.protocol.LineFeedOffCommand;
import com.github.pires.obd.commands.protocol.ObdResetCommand;
import com.github.pires.obd.commands.protocol.SelectProtocolCommand;
import com.github.pires.obd.enums.ObdProtocols;
import com.google.android.gms.common.api.ApiException;
import com.google.android.gms.common.api.ResolvableApiException;
import com.google.android.gms.location.LocationRequest;
import com.google.android.gms.location.LocationServices;
import com.google.android.gms.location.LocationSettingsRequest;
import com.google.android.gms.location.LocationSettingsResponse;
import com.google.android.gms.location.LocationSettingsStatusCodes;
import com.google.android.gms.tasks.OnCompleteListener;
import com.google.android.gms.tasks.Task;
import com.zigzag.plus.R;
import com.zigzag.plus.activity.ELDActivity;
import com.zigzag.plus.activity.LogActivity;
import com.zigzag.plus.activity.SelectDutyStatusActivity;
import com.zigzag.plus.adapter.RecapInfo;
import com.zigzag.plus.adapter.RecapRecyclerAdapter;
import com.zigzag.plus.other.DBHelper;
import com.zigzag.plus.models.mResult;
import com.zigzag.plus.other.OdometerCommand;
import com.zigzag.plus.other.Utility;
import com.zigzag.plus.other.io.MyBluetoothManager;

import org.json.JSONException;
import org.json.JSONObject;

import java.io.BufferedReader;
import java.io.DataOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.net.HttpURLConnection;
import java.net.MalformedURLException;
import java.net.ProtocolException;
import java.net.SocketTimeoutException;
import java.net.URL;
import java.nio.charset.StandardCharsets;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Calendar;
import java.util.Date;
import java.util.List;
import java.util.Locale;
import java.util.TimeZone;
import java.util.UUID;

import static android.content.Context.LOCATION_SERVICE;

public class HoSFragment extends Fragment implements View.OnClickListener
{
    public static int iRefresh = 0;
    public static int iRefreshHandler = 0;
    private static final int REQUEST_CHECK_SETTINGS = 111;

    // ContinueDriving
    // 0 - Перевесть в статус OnDuty
    // 1 - Оставатися в статусе Driving когда скорость 0
    // 2 - Показать форму для выбора стутаса Driving или OnDuty
    private static int iContinueDriving = 3;
    private static int iTimeNotDrive = 0;
    private static int iTimeMapTracing = 0;
    private static int iTimeIntermediate = 0;

    private String isLanguage = "";
    private boolean bDayNight = true;
    private String sCompanyId = "";
    private String sDriverId = "";
    private String sCoDriverId = "";
    private String sDriverName = "";
    private String sSelectedVehicleId = "";
    private String sVehicleUnit = "";
    private String sELDId = "";
    private String sTimeZoneCity = "";
    private String sDateTimeHOS = "";
    private int iCountDay = 0;
    private int iCountLast7DayWork = 0;
    private int iRecap8DaysWork = 0;
    private boolean bResetTimeLast7Day = false;
    private String sMACAddress = "";
    private String sEventTypeCode = "";
    private int iCountTime = 55;
    private int iNotConnectionELD = 0;
    private boolean bOpenELDActivity = false;
    private Double dSpeed = 0.0;
    private boolean bAuthorized = false;
    private boolean bStatusNetwork = false;
    private boolean bStatusBluetooth = false;
    private boolean bStatusGPS = false;
    private boolean bRestMode = false;
    private boolean bSplitSleeperBerth = false;

    private RecyclerView mRecyclerView;
    private RecyclerView.LayoutManager mLayoutManager;
    private RecapRecyclerAdapter mAdapter;

    private BluetoothDevice bDev = null;
    private BluetoothSocket bSock = null;

    private LocationManager locationManager;

    List<RecapInfo> recapInfoList = new ArrayList<>();

    ImageButton     ibGPSHoS;
    TextView        tvTitleHoS;
    ImageButton     ibBluetoothHoS;

    TextView        tvMessageHoS;

    TextView        tvCurrentStatusHos;
    ImageButton     ibCurrentStatusHos;

    LinearLayout    llContinueDrivingHos;
    Button          bDrivingHos;
    Button          bOnDutyHos;

    LinearLayout    llLineBDSCHos;

    ProgressBar     pbBreakHos;
    TextView        tvBreakPercentHos;
    TextView        tvBreakHrsHos;

    ProgressBar     pbDriveHos;
    TextView        tvDrivePercentHos;
    TextView        tvSSBDrivePercentHos;
    TextView        tvDriveHrsHos;

    ProgressBar     pbShiftHos;
    TextView        tvShiftPercentHos;
    TextView        tvSSBShiftPercentHos;
    TextView        tvShiftHrsHos;

    ProgressBar     pbCycleHos;
    TextView        tvCyclePercentHos;
    TextView        tvCycleHrsHos;

    LinearLayout    llLineResetHos;
    TextView        tvMinimumBreakRequiredHos;
    TextView        tvMinimumBreakRequiredTimeHos;
    ProgressBar     pbMinimumBreakRequiredHos;
    TextView        tvUntilShiftResetHos;
    TextView        tvUntilShiftResetTimeHos;
    ProgressBar     pbUntilShiftResetHos;
    TextView        tvUntilCycleResetHos;
    TextView        tvUntilCycleResetTimeHos;
    ProgressBar     pbUntilCycleResetHos;

    LinearLayout    llRestModeHos;
    ImageButton     ibRestModeHos;
    TextView        tvRestModeHos;

    TextView        tvLast7DaysHoursWorkedHos;
    TextView        tvRecap8DaysHoursWorkedHos;

    TextView        tvSplitSleeperBerthHos;
    Switch          sSplitSleeperBerth;

    DBHelper        dbHelper;

    MyTask          myTask;
    Resources       localResources;

    Handler timerHandler = new Handler();
    Runnable timerRunnable = new Runnable()
    {
        @Override
        public void run()
        {
            try
            {
                Log.d("JWT_DECODED", "iCountTime:" + iCountTime);
                // Стату Bluetooth
                if (bSock != null)
                {
                    bStatusBluetooth = true;
                    iNotConnectionELD = 0;
                    ibBluetoothHoS.setColorFilter(getResources().getColor(R.color.cGreen));
                    ibBluetoothHoS.setImageResource(R.drawable.ic_bluetooth_connected);
                }
                else
                {
                    if (iNotConnectionELD >= 1)
                    {
                        bStatusBluetooth = false;
                        ibBluetoothHoS.setColorFilter(getResources().getColor(R.color.cRed));
                        ibBluetoothHoS.setImageResource(R.drawable.ic_bluetooth_disabled);
                    }
                    else
                    {
                        iNotConnectionELD++;
                    }
                }

                // Для сохранения локации на карте
                // iTimeMapTracing - Каждые 2 минуты
                if ((sEventTypeCode.compareTo("D") == 0) ||
                        (sEventTypeCode.compareTo("ON") == 0) ||
                        (sEventTypeCode.compareTo("PC") == 0) ||
                        (sEventTypeCode.compareTo("YM") == 0))
                {
                    iTimeMapTracing++;
                }

                if (iTimeMapTracing >= 120)
                {
                    if (myTask != null)
                    {
                    }
                    else
                    {
                        iTimeMapTracing = 0;
                        myTask = new HoSFragment.MyTask();
                        myTask.execute("MapTracing");
                    }
                    myTask.link(HoSFragment.this);
                }

                // Промежуточный статус
                // iTimeIntermediate - Каждые час
                if (sEventTypeCode.compareTo("D") == 0)
                {
                    iTimeIntermediate++;
                }

                if (iTimeIntermediate >= 3600)
                {
                    if (myTask != null)
                    {
                    }
                    else
                    {
                        iTimeIntermediate = 0;
                        myTask = new HoSFragment.MyTask();
                        myTask.execute("Intermediate");
                    }
                    myTask.link(HoSFragment.this);
                }

                if (iCountTime < 60)
                {
                    if (iRefreshHandler == 1)
                    {
                        iRefreshHandler = 0;
                        LoadDate();
                    }

                    Log.d("JWT_DECODED", "bOpenELDActivity:" + bOpenELDActivity);
                    if (bOpenELDActivity == false)
                    {
                        if (myTask != null)
                        {
                        }
                        else
                        {
                            myTask = new HoSFragment.MyTask();
                            myTask.execute("GetSpeed");
                        }
                        myTask.link(HoSFragment.this);
                    }
                }
                else
                {
                    if (myTask == null)
                    {
                        //Обновление данных
                        LoadDate();
                    }

                    if (myTask != null)
                    {
                    }
                    else
                    {
                        myTask = new HoSFragment.MyTask();
                        myTask.execute("UploadToServer");
                    }
                    myTask.link(HoSFragment.this);
                    iCountTime = 0;
                }

                Log.d("JWT_DECODED", "sEventTypeCode:" + sEventTypeCode + " dSpeed:" + dSpeed + " iContinueDriving:" + iContinueDriving);
                if ((sEventTypeCode.compareTo("D") == 0) && (dSpeed <= 0) && (iContinueDriving == 2))
                {
                    int iTime = 120 - iTimeNotDrive;

                    if (iTimeNotDrive >= 2)
                    {
                        llContinueDrivingHos.setVisibility(View.VISIBLE);
                        bOnDutyHos.setText(localResources.getString(R.string.on_duty) + " ( " + iTime + " s.)");
                    }

                    if (iTime <= 1)
                    {
                        iContinueDriving = 0;
                    }

                    if (iTimeNotDrive <= 300)
                    {
                        iTimeNotDrive = iTimeNotDrive + 1;
                    }
                }
                else
                {
                    llContinueDrivingHos.setVisibility(View.GONE);
                    bOnDutyHos.setText(localResources.getString(R.string.on_duty));
                }

                //Проверка подключения к интернету
                ConnectivityManager cm = (ConnectivityManager) getActivity().getSystemService(Context.CONNECTIVITY_SERVICE);
                NetworkInfo nInfo = cm.getActiveNetworkInfo();
                if (nInfo != null && nInfo.isConnected())
                {
                    bStatusNetwork = true;
                }
                else
                {
                    bStatusNetwork = false;
                }

                //Проверка GPS
                if (locationManager.isProviderEnabled(LocationManager.GPS_PROVIDER))
                {
                    bStatusGPS = true;
                    ibGPSHoS.setColorFilter(getResources().getColor(R.color.cGreen));
                    ibGPSHoS.setImageResource(R.drawable.ic_gps_connected);
                }
                else
                {
                    bStatusGPS = false;
                    ibGPSHoS.setColorFilter(getResources().getColor(R.color.cRed));
                    ibGPSHoS.setImageResource(R.drawable.ic_gps_disabled);
                }

                // Alert Message
                if (bStatusNetwork == false)
                {
                    tvMessageHoS.setVisibility(View.VISIBLE);
                    tvMessageHoS.setText(localResources.getString(R.string.offline_mode_check_your_internet_connection));
                }
                else if (bStatusBluetooth == false)
                {
                    BluetoothAdapter btAdapter = BluetoothAdapter.getDefaultAdapter();
                    if (!btAdapter.isEnabled())
                    {
                        tvMessageHoS.setVisibility(View.VISIBLE);
                        tvMessageHoS.setText(localResources.getString(R.string.bluetooth_is_enabled_on_the_mobile_device));
                    }
                    else if (iNotConnectionELD >= 1)
                    {
                        tvMessageHoS.setVisibility(View.VISIBLE);
                        tvMessageHoS.setText(localResources.getString(R.string.please_verify_the_following_items) + "\n" +
                                " * " + localResources.getString(R.string.eld_hardware_is_properly_installed) + "\n" +
                                " * " + localResources.getString(R.string.vehicle_power_is_on));
                    }
                }
                else if (bStatusGPS == false)
                {
                    tvMessageHoS.setVisibility(View.VISIBLE);
                    tvMessageHoS.setText(localResources.getString(R.string.gps_is_enabled_on_the_mobile_device));
                }
                else
                {
                    tvMessageHoS.setVisibility(View.GONE);
                }
            }
            catch (Exception e)
            {
            }

            iCountTime = iCountTime + 1;

            // Таймер - 1 секунда
            timerHandler.postDelayed(timerRunnable, 1000);
        }
    };

    public HoSFragment()
    {
    }

    @Override
    public void onCreate(Bundle savedInstanceState)
    {
        super.onCreate(savedInstanceState);
        // Сохраняет состояние фрагмента вне зависимости от изменения ориентации.
        setRetainInstance(true);

        // Таймер - 1 секунды
        timerHandler.postDelayed(timerRunnable, 1000);
    }

    @Override
    public View onCreateView(LayoutInflater inflater, ViewGroup container,
                             Bundle savedInstanceState)
    {
        // Inflate the layout for this fragment
        return inflater.inflate(R.layout.fragment_hos, container, false);
    }

    @Override
    public void onViewCreated(View view, Bundle savedInstanceState)
    {
        // Найдем View-элементы
        ibGPSHoS                        = (ImageButton)     getView().findViewById(R.id.iibGPSHoS);
        tvTitleHoS                      = (TextView)        getView().findViewById(R.id.itvTitleHoS);
        ibBluetoothHoS                  = (ImageButton)     getView().findViewById(R.id.iibBluetoothHoS);

        tvMessageHoS                    = (TextView)        getView().findViewById(R.id.itvMessageHoS);

        tvCurrentStatusHos              = (TextView)        getView().findViewById(R.id.itvCurrentStatusHos);
        ibCurrentStatusHos              = (ImageButton)     getView().findViewById(R.id.iibCurrentStatusHos);

        llContinueDrivingHos            = (LinearLayout)    getView().findViewById(R.id.illContinueDrivingHos);
        bDrivingHos                     = (Button)          getView().findViewById(R.id.ibDrivingHos);
        bOnDutyHos                      = (Button)          getView().findViewById(R.id.ibOnDutyHos);

        llLineBDSCHos                   = (LinearLayout)    getView().findViewById(R.id.illLineBDSCHos);

        pbBreakHos                      = (ProgressBar)     getView().findViewById(R.id.ipbBreakHos);
        tvBreakPercentHos               = (TextView)        getView().findViewById(R.id.itvBreakPercentHos);
        tvBreakHrsHos                   = (TextView)        getView().findViewById(R.id.itvBreakHrsHos);

        pbDriveHos                      = (ProgressBar)     getView().findViewById(R.id.ipbDriveHos);
        tvDrivePercentHos               = (TextView)        getView().findViewById(R.id.itvDrivePercentHos);
        tvSSBDrivePercentHos            = (TextView)        getView().findViewById(R.id.itvSSBDrivePercentHos);
        tvDriveHrsHos                   = (TextView)        getView().findViewById(R.id.itvDriveHrsHos);

        pbShiftHos                      = (ProgressBar)     getView().findViewById(R.id.ipbShiftHos);
        tvShiftPercentHos               = (TextView)        getView().findViewById(R.id.itvShiftPercentHos);
        tvSSBShiftPercentHos            = (TextView)        getView().findViewById(R.id.itvSSBShiftPercentHos);
        tvShiftHrsHos                   = (TextView)        getView().findViewById(R.id.itvShiftHrsHos);

        pbCycleHos                      = (ProgressBar)     getView().findViewById(R.id.ipbCycleHos);
        tvCyclePercentHos               = (TextView)        getView().findViewById(R.id.itvCyclePercentHos);
        tvCycleHrsHos                   = (TextView)        getView().findViewById(R.id.itvCycleHrsHos);

        llLineResetHos                  = (LinearLayout)    getView().findViewById(R.id.illLineResetHos);
        tvMinimumBreakRequiredHos       = (TextView)        getView().findViewById(R.id.itvMinimumBreakRequiredHos);
        tvMinimumBreakRequiredTimeHos   = (TextView)        getView().findViewById(R.id.itvMinimumBreakRequiredTimeHos);
        pbMinimumBreakRequiredHos       = (ProgressBar)     getView().findViewById(R.id.ipbMinimumBreakRequiredHos);
        tvUntilShiftResetHos            = (TextView)        getView().findViewById(R.id.itvUntilShiftResetHos);
        tvUntilShiftResetTimeHos        = (TextView)        getView().findViewById(R.id.itvUntilShiftResetTimeHos);
        pbUntilShiftResetHos            = (ProgressBar)     getView().findViewById(R.id.ipbUntilShiftResetHos);
        tvUntilCycleResetHos            = (TextView)        getView().findViewById(R.id.itvUntilCycleResetHos);
        tvUntilCycleResetTimeHos        = (TextView)        getView().findViewById(R.id.itvUntilCycleResetTimeHos);
        pbUntilCycleResetHos            = (ProgressBar)     getView().findViewById(R.id.ipbUntilCycleResetHos);

        llRestModeHos                   = (LinearLayout)    getView().findViewById(R.id.illRestModeHos);
        ibRestModeHos                   = (ImageButton)     getView().findViewById(R.id.iibRestModeHos);
        tvRestModeHos                   = (TextView)        getView().findViewById(R.id.itvRestModeHos);

        tvLast7DaysHoursWorkedHos       = (TextView)        getView().findViewById(R.id.itvLast7DaysHoursWorkedHos);
        tvRecap8DaysHoursWorkedHos      = (TextView)        getView().findViewById(R.id.itvRecap8DaysHoursWorkedHos);

        tvSplitSleeperBerthHos          = (TextView)        getView().findViewById(R.id.itvSplitSleeperBerthHos);
        sSplitSleeperBerth              = (Switch)          getView().findViewById(R.id.isSplitSleeperBerth);

        mRecyclerView                   = (RecyclerView)    getView().findViewById(R.id.irvLogAndRecapHos);

        // Присваиваем обработчик кнопкам
        ibGPSHoS.setOnClickListener(this);
        ibBluetoothHoS.setOnClickListener(this);

        tvCurrentStatusHos.setOnClickListener(this);
        ibCurrentStatusHos.setOnClickListener(this);

        bDrivingHos.setOnClickListener(this);
        bOnDutyHos.setOnClickListener(this);
        llRestModeHos.setOnClickListener(this);

        sSplitSleeperBerth.setOnClickListener(this);

        mRecyclerView.setHasFixedSize(true);
        mLayoutManager = new LinearLayoutManager(getContext());
        mRecyclerView.setLayoutManager(mLayoutManager);

        mAdapter = new RecapRecyclerAdapter(recapInfoList);
        mRecyclerView.setAdapter(mAdapter);

        tvMessageHoS.setVisibility(View.GONE);
        llContinueDrivingHos.setVisibility(View.GONE);

        // создаем объект для создания и управления версиями БД
        dbHelper = new DBHelper(getActivity());

        locationManager = (LocationManager) getContext().getSystemService(LOCATION_SERVICE);

        CheckGPS(false);
        CheckBluetooth();

        // Загрузка данных
        LoadDate();

        mRecyclerView.addOnItemTouchListener(new HoSFragment.RecyclerTouchListener(getContext(), mRecyclerView, new HoSFragment.ClickListener()
        {
            public void onClick(View view, final int position)
            {
                //Values are passing to activity & to fragment as well
                try
                {
                    RecapInfo ciItem = recapInfoList.get(position);

                    SharedPreferences myPrefs = getActivity().getSharedPreferences(getActivity().getPackageName() + "_preferences", Context.MODE_PRIVATE);
                    SharedPreferences.Editor edd;

                    edd = myPrefs.edit();
                    edd.putString("DayLog", ciItem.getWeekRecap() + ", " + ciItem.getDayRecap());
                    edd.putString("Days", ciItem.getDateRecap());
                    edd.putString("LogDailiesId", ciItem.getLogDailiesId());
                    edd.commit();

                    Intent intentSet = new Intent();
                    intentSet.setClass(getContext(), LogActivity.class);
                    startActivity(intentSet);
                    getActivity().overridePendingTransition(R.anim.slide_left_in, R.anim.slide_left_out);

                }
                catch (Exception $e)
                {
                }
            }

            public void onLongClick(View view, int position)
            {
                //Toast.makeText(MainActivity.this, "Long press on position :"+position,  Toast.LENGTH_LONG).show();
            }
        }));
    }

    @SuppressLint({"Range", "UseCompatLoadingForDrawables"})
    private void LoadDate()
    {
        SharedPreferences myPrefs = getActivity().getSharedPreferences(getActivity().getPackageName() + "_preferences", Context.MODE_PRIVATE);
        isLanguage          = myPrefs.getString("isLanguage", "en");
        bDayNight           = myPrefs.getBoolean("day_night", true); // true - day, false - night
        sCompanyId          = myPrefs.getString("sCompanyId", "");
        sDriverId           = myPrefs.getString("sDriverId", "");
        sCoDriverId         = myPrefs.getString("sCoDriverId", "");
        sDriverName         = myPrefs.getString("sDriverName", "");
        sSelectedVehicleId  = myPrefs.getString("sSelectedVehicleId", "");
        sVehicleUnit        = myPrefs.getString("sVehicleUnit", "");
        sELDId              = myPrefs.getString("sELDId", "");
        sMACAddress         = myPrefs.getString("sMACAddress", "");
        bAuthorized         = myPrefs.getBoolean("bAuthorized", false);
        bSplitSleeperBerth  = myPrefs.getBoolean("bSplitSleeperBerth", false);

        // Язык пользователя
        Resources baseResources = getResources();
        Locale locale = new Locale(isLanguage);
        Locale.setDefault(locale);
        Configuration config = new Configuration();
        config.locale = locale;
        localResources = new Resources(baseResources.getAssets(), baseResources.getDisplayMetrics(), config);

        tvTitleHoS.setText(sDriverName + " - " + sVehicleUnit);

        // Для размешения CircleProgressBar / HORIZONTAL - 2 в ряд / VERTICAL - 4 в ряд
        float dpWidth = 0;
        try
        {
            DisplayMetrics displayMetrics = getActivity().getResources().getDisplayMetrics();
            dpWidth = displayMetrics.widthPixels / displayMetrics.density;
        }
        catch (Exception $e)
        {
        }

        if (dpWidth >= 600)
        {
            llLineBDSCHos.setOrientation(LinearLayout.HORIZONTAL);
        }
        else
        {
            llLineBDSCHos.setOrientation(LinearLayout.VERTICAL);
        }

        recapInfoList.clear();
        RecapInfo ciItem;

        // Подключаемся к БД
        SQLiteDatabase db = dbHelper.getWritableDatabase();

        // ***************************************************************
        // Get TimeZone Company
        String sTimeZoneCity = "";
        String sTimeZone = " SELECT time_zone_city " +
                " FROM company " +
                " WHERE company_id = '" + sCompanyId + "' ";

        // Данные из базы --
        Cursor cTimeZone = db.rawQuery(sTimeZone, null);
        if (cTimeZone.moveToFirst())
        {
            do
            {
                sTimeZoneCity = cTimeZone.getString(cTimeZone.getColumnIndex("time_zone_city"));
            } while (cTimeZone.moveToNext());
        }
        cTimeZone.close();

        // Формат даты
        SimpleDateFormat dfDate = new SimpleDateFormat("yyyy-MM-dd'T'00:00:00");
        SimpleDateFormat dfDateTime = new SimpleDateFormat("yyyy-MM-dd'T'HH:mm:ss");

        dfDate.setTimeZone(TimeZone.getTimeZone(sTimeZoneCity));
        dfDateTime.setTimeZone(TimeZone.getTimeZone(sTimeZoneCity));

        // Массив из последних 14 дней
        Calendar cCalendar = Calendar.getInstance();
        String sDay14day = "";
        String[] saDay = new String[14];
        int[] iaDayStatus = new int[14];

        for (int i = 0; i < 14; i++)
        {
            saDay[i] = dfDate.format(cCalendar.getTime().getTime());
            iaDayStatus[i] = 0;

            sDay14day = dfDate.format(cCalendar.getTime().getTime());

            cCalendar.add(Calendar.DAY_OF_MONTH, -1);
        }

        // ***************************************************************
        // Данныйе о водителе
        int iHoursOfServiceRuleDays = 0, iHoursOfServiceRuleHours = 0;
        String sSelectDriver = " SELECT assigned_vehicles_id, hours_of_service_rule_days, hours_of_service_rule_hours " +
                " FROM driver " +
                " WHERE driver_id = '" + sDriverId + "' ";

        // Данные из базы --
        Cursor cDriver = db.rawQuery(sSelectDriver, null);
        if (cDriver.moveToFirst())
        {
            do
            {
                iHoursOfServiceRuleDays = cDriver.getInt(cDriver.getColumnIndex("hours_of_service_rule_days"));
                iHoursOfServiceRuleHours = cDriver.getInt(cDriver.getColumnIndex("hours_of_service_rule_hours"));
            } while (cDriver.moveToNext());
        }
        cDriver.close();

        // Текущие время - количество дней в настройки HOS
        Calendar cCalendarHOS = Calendar.getInstance();
        Calendar cCalendar24Hours = Calendar.getInstance();

        cCalendarHOS.add(Calendar.DAY_OF_MONTH, -iHoursOfServiceRuleDays + 1);
        cCalendar24Hours.add(Calendar.DAY_OF_MONTH, -1);
        String sDateTimeHOS = dfDate.format(cCalendarHOS.getTime().getTime());

        // ***************************************************************
        // Данные о статусе водителя
        // USA 70 hour / 8 day
        // DOT Inspection 7 days + today
        // Recap = D + ON - 8 day - это время 8 дня назад (без учета сегодняшнего)
        // Данный метод подходит для водителей который работают по 8:45 часов в день
        /*String sRecapLogHistories = " SELECT date_bgn, date_end, event_type_code, location_description " +
                " FROM log_histories " +
                " WHERE ('" + sDateTimeHOS + "' < date_end OR date_end is null) " +
                " AND event_type_code in ('OFF', 'WT', 'SB', 'D', 'ON', 'PC', 'YM')" +
                " ORDER BY date_bgn ";*/

        // ***************************************************************
        // Данные о статусе водителя
        // Из LogHistories высчитываем время: Break / Drive / Shift / Cycle
        // По iHoursOfServiceRuleDays
        // Время в секундах
        int iAvailableBreakFull = 8 * 60 * 60, iAvailableDriveFull = 11 * 60 * 60, iAvailableShiftFull = 14 * 60 * 60, iAvailableCycleFull = iHoursOfServiceRuleHours * 60 * 60;
        int iAvailableBreak = 8 * 60 * 60, iAvailableDrive = 11 * 60 * 60, iAvailableShift = 14 * 60 * 60, iAvailableCycle = iHoursOfServiceRuleHours * 60 * 60;
        int iProgressBreak = 0, iProgressDrive = 0, iProgressShift = 0, iProgressCycle = 0;
        int iTime = 0, iTimeBreak = 0, iTimeNotDrive = 0, iTimeCycle = 0, iTimeON = 0, iTimeD = 0, iTimeOFF = 0, iTimeRecap = 0;
        int iSplitSleeperBerth2or3 = 0, iSplitSleeperBerth8or7 = 0;
        int iBreakReset = 0, iShiftReset = 0, iCycleReset = 0;
        int iBreakResetFull = 30 * 60, iShiftResetFull = 10 * 60 * 60, iCycleResetFull = 34 * 60 * 60;

        String sLocationDescription = "", sDateBgn = "", sDateEnd = "";
        String sLastLogHistories = " SELECT date_bgn, date_end, event_type_code, location_description " +
                " FROM log_histories " +
                " WHERE ('" + sDateTimeHOS + "' < date_end OR date_end is null) " +
                " AND event_type_code in ('OFF', 'WT', 'SB', 'D', 'ON', 'PC', 'YM')" +
                " ORDER BY date_bgn ";

        // Данные из базы --
        Cursor cLastLogHistories = db.rawQuery(sLastLogHistories, null);
        if (cLastLogHistories.moveToFirst())
        {
            do
            {
                sDateBgn = cLastLogHistories.getString(cLastLogHistories.getColumnIndex("date_bgn"));
                sDateEnd = cLastLogHistories.getString(cLastLogHistories.getColumnIndex("date_end"));
                sEventTypeCode = cLastLogHistories.getString(cLastLogHistories.getColumnIndex("event_type_code"));
                sLocationDescription = cLastLogHistories.getString(cLastLogHistories.getColumnIndex("location_description"));

                if (sDateEnd == null)
                {
                    sDateEnd = Utility.getCurrentDate(sTimeZoneCity);
                }
                else
                {
                    sDateEnd = cLastLogHistories.getString(cLastLogHistories.getColumnIndex("date_end"));
                }

                iTime = Utility.getSeconds(sDateBgn, sDateEnd);

                switch (sEventTypeCode)
                {
                    case "OFF":
                    case "SB":
                        iTimeOFF = iTimeOFF + iTime;
                        iTimeNotDrive = iTimeNotDrive + iTime;

                        // Split Sleeper Berth
                        // 8 or 7 : Hours = Sleeper Berth
                        // 2 or 3 : Hours = Sleeper Berth or Off Duty
                        // Непрерывный отдых 10 часа - для сброса времени: вождения и работы
                        // Можно разделить на:
                        // 8/2 - 8 непрерывный отдых + (потом работа) + 2 отдыха
                        // 7/3 - 7 непрерывный отдых + (потом работа) + 3 отдыха
                        // 7 и 8 часов не учитываются в shift а 3 и 2 часа учитываются
                        if ((iTime >= (2 * 60 * 60)) && (iTime < (4 * 60 * 60)))
                        {
                            // Не учитываем это время
                            iSplitSleeperBerth2or3 = iSplitSleeperBerth2or3 + iTime;
                        }

                        if ((sEventTypeCode.compareTo("SB") == 0) && (iTime >= (7 * 60 * 60)) && (iTime < (9 * 60 * 60)))
                        {
                            // Не учитываем это время
                            iSplitSleeperBerth8or7 = iSplitSleeperBerth8or7 + iTime;
                        }

                        // Непрерывный отдых 34/24 часа - для сброса общего времени
                        if (iTime >= iCycleResetFull)
                        {
                            iTimeCycle = 0;
                            iTimeRecap = 0;
                            bResetTimeLast7Day = true;
                        }

                        // Непрерывный отдых 10 часа - для сброса времени: вождения и работы
                        if (iTime >= iShiftResetFull)
                        {
                            iTimeON = 0;
                            iTimeD = 0;
                            iTimeOFF = 0;
                            iSplitSleeperBerth2or3 = 0;
                            iSplitSleeperBerth8or7 = 0;
                        }

                        iShiftReset = iShiftResetFull - iTime;
                        iCycleReset = iCycleResetFull - iTime;
                        break;

                    case "D":
                        iTimeD = iTimeD + iTime;
                        iTimeBreak = iTimeBreak + iTime;
                        iTimeCycle = iTimeCycle + iTime;

                        iTimeNotDrive = 0;
                        iShiftReset = iShiftResetFull;
                        iCycleReset = iCycleResetFull;
                        break;

                    case "ON":
                    case "PC":
                    case "YM":
                        iTimeON = iTimeON + iTime;
                        iTimeCycle = iTimeCycle + iTime;
                        iTimeNotDrive = iTimeNotDrive + iTime;

                        iShiftReset = iShiftResetFull;
                        iCycleReset = iCycleResetFull;
                        break;
                }

                // Отдых 30 минут - для сброса времени неприрывного вождения максимум 8 часов
                if (iTimeNotDrive >= iBreakResetFull)
                {
                    iTimeBreak = 0;
                }

                iBreakReset = iBreakResetFull - iTimeNotDrive;

            } while (cLastLogHistories.moveToNext());
        }
        cLastLogHistories.close();

        // Нет данных в базе
        if (sEventTypeCode.isEmpty())
        {
            sEventTypeCode = "OFF";
        }

        tvCurrentStatusHos.setText(localResources.getString(R.string.current_status) + " " + Utility.getEventTypeName(sEventTypeCode, localResources) + " (" + Utility.getHoursOfSeconds(iTime, false) + ")");

        switch (sEventTypeCode)
        {
            case "OFF":
                tvCurrentStatusHos.setBackgroundResource(R.color.cOffDuty);
                ibCurrentStatusHos.setBackgroundResource(R.color.cOffDuty);
                break;

            case "PC":
                tvCurrentStatusHos.setBackgroundResource(R.color.cPersonalConveyance);
                ibCurrentStatusHos.setBackgroundResource(R.color.cPersonalConveyance);
                break;

            case "SB":
                tvCurrentStatusHos.setBackgroundResource(R.color.cSleeper);
                ibCurrentStatusHos.setBackgroundResource(R.color.cSleeper);
                break;

            case "D":
                tvCurrentStatusHos.setBackgroundResource(R.color.cDriving);
                ibCurrentStatusHos.setBackgroundResource(R.color.cDriving);
                bRestMode = false;
                break;

            case "ON":
                tvCurrentStatusHos.setBackgroundResource(R.color.cOnDuty);
                ibCurrentStatusHos.setBackgroundResource(R.color.cOnDuty);
                break;

            case "YM":
                tvCurrentStatusHos.setBackgroundResource(R.color.cYardMoves);
                ibCurrentStatusHos.setBackgroundResource(R.color.cYardMoves);
                break;
        }

        // Привышен лимит по времени
        if ((iAvailableBreak < iTimeBreak) ||
                (iAvailableDrive < iTimeD) ||
                (iAvailableShift < iTimeD - iTimeON) ||
                (iAvailableCycle < iTimeCycle)
        )
        {
            switch (sEventTypeCode)
            {
                case "D":
                    tvCurrentStatusHos.setBackgroundResource(R.color.cRed);
                    ibCurrentStatusHos.setBackgroundResource(R.color.cRed);
                    break;
            }
        }

        if (iAvailableCycle < iTimeCycle)
        {
            iAvailableBreak = 0;
            iAvailableDrive = 0;
            iAvailableShift = 0;
        }

        if (iAvailableDrive < iTimeD)
        {
            iAvailableBreak = 0;
        }

        // iAvailableShift
        // Drive + On Duty + (Off Duty + Sleeper Berth) < 0
        // Нарушения время работы
        if (iAvailableShift - iTimeD - iTimeON - iTimeOFF < 0)
        {
            if (sEventTypeCode.compareTo("OFF") == 0 || sEventTypeCode.compareTo("SB") == 0)
            {
                if (iAvailableShift - iTimeD - iTimeON < 0)
                {
                    iAvailableShift = -1;
                }
                else
                {
                    if (iTimeD + iTimeON + iTimeOFF < iAvailableShift)
                    {
                        iAvailableShift = iAvailableShift - iTimeD - iTimeON - iTimeOFF;
                    }
                    else
                    {
                        iAvailableShift = 0;
                    }
                }
            }
            else
            {
                if (iAvailableShift + iSplitSleeperBerth8or7 + iSplitSleeperBerth2or3 - iTimeD - iTimeON - iTimeOFF < 0)
                {
                    iAvailableShift = iAvailableShift + iSplitSleeperBerth8or7 + iSplitSleeperBerth2or3 - iTimeD - iTimeON - iTimeOFF;
                }
                else
                {
                    iAvailableShift = iAvailableShift + iSplitSleeperBerth8or7 + iSplitSleeperBerth2or3 - iTimeD - iTimeON - iTimeOFF;
                }


                iAvailableShift = iAvailableShift - iTimeD - iTimeON - iTimeOFF;
            }
        }
        else
        {
            iAvailableShift = iAvailableShift - iTimeD - iTimeON - iTimeOFF;
        }

        if (iAvailableShift >= 0)
        {
            tvShiftPercentHos.setText(Utility.getHoursOfSeconds(iAvailableShift, false));
            iProgressShift = 100 * iAvailableShift / iAvailableShiftFull;
            pbShiftHos.setProgress(iProgressShift);
            pbShiftHos.setScaleX(-1);

            if (iAvailableShift <= (30 * 60) && (sEventTypeCode.compareTo("D") == 0 || sEventTypeCode.compareTo("ON") == 0))
            {
                tvShiftHrsHos.setText(localResources.getString(R.string.warning));
                tvShiftHrsHos.setTextColor(getResources().getColor(R.color.cYellowText));
                pbShiftHos.setBackgroundResource(R.drawable.circle_yellow);
                pbShiftHos.setProgressDrawable(getResources().getDrawable(R.drawable.progressbar_yellow));
            }
            else
            {
                tvShiftHrsHos.setText(localResources.getString(R.string.hrs));
                tvShiftHrsHos.setTextColor(getResources().getColor(R.color.cGray));
                pbShiftHos.setBackgroundResource(R.drawable.circle);
                pbShiftHos.setProgressDrawable(getResources().getDrawable(R.drawable.progressbar));
            }
        }
        else
        {
            tvShiftPercentHos.setText(Utility.getHoursOfSeconds(-iAvailableShift, false));
            iProgressShift = 100 * -iAvailableShift / iAvailableShiftFull;
            pbShiftHos.setProgress(iProgressShift);
            pbShiftHos.setBackgroundResource(R.drawable.circle_red);
            pbShiftHos.setProgressDrawable(getResources().getDrawable(R.drawable.progressbar_red));
            pbShiftHos.setScaleX(1);

            tvShiftHrsHos.setText(localResources.getString(R.string.violation));
            tvShiftHrsHos.setTextColor(getResources().getColor(R.color.cRed));
        }

        // iAvailableDrive
        iAvailableDrive = iAvailableDrive - iTimeD;

        /*if (iAvailableDrive > iAvailableShift)
        {
            if (iAvailableShift > 0)
            {
                iAvailableDrive = iAvailableShift;
            }
        }*/

        if (iAvailableDrive >= 0)
        {
            tvDrivePercentHos.setText(Utility.getHoursOfSeconds(iAvailableDrive, false));
            iProgressDrive = 100 * iAvailableDrive / iAvailableDriveFull;
            pbDriveHos.setProgress(iProgressDrive);
            pbDriveHos.setScaleX(-1);

            if (iAvailableDrive <= (30 * 60) && (sEventTypeCode.compareTo("D") == 0))
            {
                tvDriveHrsHos.setText(localResources.getString(R.string.warning));
                tvDriveHrsHos.setTextColor(getResources().getColor(R.color.cYellowText));
                pbDriveHos.setBackgroundResource(R.drawable.circle_yellow);
                pbDriveHos.setProgressDrawable(getResources().getDrawable(R.drawable.progressbar_yellow));
            }
            else
            {
                tvDriveHrsHos.setText(localResources.getString(R.string.hrs));
                tvDriveHrsHos.setTextColor(getResources().getColor(R.color.cGray));
                pbDriveHos.setBackgroundResource(R.drawable.circle);
                pbDriveHos.setProgressDrawable(getResources().getDrawable(R.drawable.progressbar));
            }
        }
        else
        {
            tvDrivePercentHos.setText(Utility.getHoursOfSeconds(-iAvailableDrive, false));
            iProgressDrive = 100 * -iAvailableDrive / iAvailableDriveFull;
            pbDriveHos.setProgress(iProgressDrive);
            pbDriveHos.setBackgroundResource(R.drawable.circle_red);
            pbDriveHos.setProgressDrawable(getResources().getDrawable(R.drawable.progressbar_red));
            pbDriveHos.setScaleX(1);

            tvDriveHrsHos.setText(localResources.getString(R.string.violation));
            tvDriveHrsHos.setTextColor(getResources().getColor(R.color.cRed));
        }

        // iAvailableBreak
        iAvailableBreak = iAvailableBreak - iTimeBreak;

        /*if (iAvailableBreak > iAvailableDrive)
        {
            iAvailableBreak = iAvailableDrive;
        }*/

        if (iAvailableBreak >= 0)
        {
            tvBreakPercentHos.setText(Utility.getHoursOfSeconds(iAvailableBreak, false));
            iProgressBreak = 100 * iAvailableBreak / iAvailableBreakFull;
            pbBreakHos.setProgress(iProgressBreak);
            pbBreakHos.setScaleX(-1);

            if (iAvailableBreak <= (30 * 60) && (sEventTypeCode.compareTo("D") == 0))
            {
                tvBreakHrsHos.setText(localResources.getString(R.string.warning));
                tvBreakHrsHos.setTextColor(getResources().getColor(R.color.cYellowText));
                pbBreakHos.setBackgroundResource(R.drawable.circle_yellow);
                pbBreakHos.setProgressDrawable(getResources().getDrawable(R.drawable.progressbar_yellow));
            }
            else
            {
                tvBreakHrsHos.setText(localResources.getString(R.string.hrs));
                tvBreakHrsHos.setTextColor(getResources().getColor(R.color.cGray));
                pbBreakHos.setBackgroundResource(R.drawable.circle);
                pbBreakHos.setProgressDrawable(getResources().getDrawable(R.drawable.progressbar));
            }
        }
        else
        {
            tvBreakPercentHos.setText(Utility.getHoursOfSeconds(-iAvailableBreak, false));
            iProgressBreak = 100 * -iAvailableBreak / iAvailableBreakFull;
            pbBreakHos.setProgress(iProgressBreak);
            pbBreakHos.setBackgroundResource(R.drawable.circle_red);
            pbBreakHos.setProgressDrawable(getResources().getDrawable(R.drawable.progressbar_red));
            pbBreakHos.setScaleX(1);

            tvBreakHrsHos.setText(localResources.getString(R.string.violation));
            tvBreakHrsHos.setTextColor(getResources().getColor(R.color.cRed));
        }

        // iAvailableCycle
        iAvailableCycle = iAvailableCycle - iTimeCycle;

        if (iAvailableCycle >= 0)
        {
            tvCyclePercentHos.setText(Utility.getHoursOfSeconds(iAvailableCycle, false));
            iProgressCycle = 100 * iAvailableCycle / iAvailableCycleFull;
            pbCycleHos.setProgress(iProgressCycle);
            pbCycleHos.setScaleX(-1);

            if (iAvailableCycle <= (30 * 60) && (sEventTypeCode.compareTo("D") == 0 || sEventTypeCode.compareTo("ON") == 0))
            {
                tvCycleHrsHos.setText(localResources.getString(R.string.warning));
                tvCycleHrsHos.setTextColor(getResources().getColor(R.color.cYellowText));
                pbCycleHos.setBackgroundResource(R.drawable.circle_yellow);
                pbCycleHos.setProgressDrawable(getResources().getDrawable(R.drawable.progressbar_yellow));
            }
            else
            {
                tvCycleHrsHos.setText(localResources.getString(R.string.hrs));
                tvCycleHrsHos.setTextColor(getResources().getColor(R.color.cGray));
                pbCycleHos.setBackgroundResource(R.drawable.circle);
                pbCycleHos.setProgressDrawable(getResources().getDrawable(R.drawable.progressbar));
            }

        }
        else
        {
            tvCyclePercentHos.setText(Utility.getHoursOfSeconds(-iAvailableCycle, false));
            iProgressCycle = 100 * -iAvailableCycle / iAvailableCycleFull;
            pbCycleHos.setProgress(iProgressCycle);
            pbCycleHos.setBackgroundResource(R.drawable.circle_red);
            pbCycleHos.setProgressDrawable(getResources().getDrawable(R.drawable.progressbar_red));
            pbCycleHos.setScaleX(1);

            tvCycleHrsHos.setText(localResources.getString(R.string.violation));
            tvCycleHrsHos.setTextColor(getResources().getColor(R.color.cRed));
        }

        ContentValues cv = new ContentValues();
        cv.clear();
        cv.put("driver_id", sDriverId);
        cv.put("status_duty", sEventTypeCode);
        cv.put("location_description", sLocationDescription);
        cv.put("available_break", iAvailableBreak);
        cv.put("available_drive", iAvailableDrive);
        cv.put("available_shift", iAvailableShift);
        cv.put("available_cycle", iAvailableCycle);
        cv.put("last_history_date", sDateBgn);

        // View exist Log Dailies
        int r = db.update("driver_statuses", cv, "driver_id = '" + sDriverId + "' ", null);
        if (r == 0)
        {
            db.insert("driver_statuses", null, cv);
        }

        // Rest Mode
        if (sEventTypeCode.compareTo("D") == 0)
        {
            llRestModeHos.setVisibility(View.GONE);
        }
        else
        {
            llRestModeHos.setVisibility(View.VISIBLE);
        }

        CheckRestMode(iBreakReset,
                      iBreakResetFull,
                      iShiftReset,
                      iShiftResetFull,
                      iCycleReset,
                      iCycleResetFull);

        sSplitSleeperBerth.setChecked(bSplitSleeperBerth);
        CheckSplitSleeperBerth(bSplitSleeperBerth);

        Date dDay = null;
        String sDay = "";
        // ***************************************************************
        // Проверка Log dailies - существуют последний 14 дней
        String sSelectQuery14Day = " SELECT day FROM log_dailies WHERE day >= '" + sDay14day + "' ORDER BY day desc";

        // Данные из базы --
        Cursor cLogDailies14Day = db.rawQuery(sSelectQuery14Day, null);
        if (cLogDailies14Day.moveToFirst())
        {
            do
            {
                dDay = null;
                sDay = "";

                try
                {
                    dDay = dfDate.parse(cLogDailies14Day.getString(cLogDailies14Day.getColumnIndex("day")));
                    sDay = dfDate.format(dDay);
                }
                catch (ParseException e)
                {
                }

                for (int i = 0; i < 14; i++)
                {
                    if (saDay[i].compareTo(sDay) == 0)
                    {
                        iaDayStatus[i] = 1;
                    }
                }
            } while (cLogDailies14Day.moveToNext());
        }
        cLogDailies14Day.close();

        // Add New Days
        for (int i = 0; i < 14; i++)
        {
            if (iaDayStatus[i] == 0)
            {
                cv.clear();
                cv.put("company_id", sCompanyId);
                cv.put("driver_id", sDriverId);
                cv.put("vehicle_id", sSelectedVehicleId);
                cv.put("log_dailies_id", UUID.randomUUID().toString());
                cv.put("day", saDay[i]);
                cv.put("hours_off_duty", 0);
                cv.put("hours_sleeper", 0);
                cv.put("hours_driving", 0);
                cv.put("hours_on_duty", 0);
                cv.put("hours_worked", 0);
                cv.put("violations", "");
                cv.put("form_manner", 0);
                cv.put("trailers", "");
                cv.put("shipping_doc", "");
                cv.put("certified", 0);
                // cv.put("certify_timestamp", obj.getString(""));
                cv.put("signature", "");
                cv.put("upload", 0);

                // View exist Log Dailies
                db.insert("log_dailies", null, cv);
            }
        }

        // Подсчет времени - с даты последнего лога
        try
        {
            sDay = dfDate.format(dfDate.parse(sDateBgn));
        }
        catch (ParseException e)
        {
        }

        float durationsOFF = 0;
        float durationsSB = 0;
        float durationsD = 0;
        float durationsON = 0;
        float durationsBaseOFF = 0;
        float durationsBaseSB = 0;
        float durationsBaseD = 0;
        float durationsBaseON = 0;
        Date dDate, dDateBgn, dDateEnd;

        String sLogDailiesCalc = " SELECT day, log_dailies_id, " +
                " hours_off_duty, hours_sleeper, hours_driving, hours_on_duty " +
                " FROM log_dailies " +
                " WHERE day >= '" + sDay + "'  " +
                " ORDER BY day ";

        // Данные из базы --
        Cursor cLogDailiesCalc = db.rawQuery(sLogDailiesCalc, null);
        if (cLogDailiesCalc.moveToFirst())
        {
            do
            {
                durationsOFF = 0;
                durationsSB = 0;
                durationsD = 0;
                durationsON = 0;

                durationsBaseOFF = 0;
                durationsBaseSB = 0;
                durationsBaseD = 0;
                durationsBaseON = 0;

                try
                {
                    durationsBaseOFF = cLogDailiesCalc.getInt(cLogDailiesCalc.getColumnIndex("hours_off_duty"));
                    durationsBaseSB = cLogDailiesCalc.getInt(cLogDailiesCalc.getColumnIndex("hours_sleeper"));
                    durationsBaseD = cLogDailiesCalc.getInt(cLogDailiesCalc.getColumnIndex("hours_driving"));
                    durationsBaseON = cLogDailiesCalc.getInt(cLogDailiesCalc.getColumnIndex("hours_on_duty"));
                }
                catch (Exception $e)
                {
                }

                // Log day
                String sSelectQuery = " SELECT date_bgn, date_end, event_type_code  " +
                        " FROM  log_histories " +
                        " WHERE (log_dailies_id = '" + cLogDailiesCalc.getString(cLogDailiesCalc.getColumnIndex("log_dailies_id")) + "' " +
                        " OR     event_sequence_number = (SELECT max(event_sequence_number) " +
                        "                                FROM   log_histories " +
                        "                                WHERE  log_dailies_id != '" + cLogDailiesCalc.getString(cLogDailiesCalc.getColumnIndex("log_dailies_id")) + "' " +
                        "                                AND    date_bgn < '" + cLogDailiesCalc.getString(cLogDailiesCalc.getColumnIndex("day")) + "'  " +
                        "                               ) ) " +
                        " AND event_type_code in ('OFF', 'WT', 'SB', 'D', 'ON', 'PC', 'YM') " +
                        " ORDER BY event_sequence_number";

                // Данные из базы --
                Cursor cLogHistoriesCalc = db.rawQuery(sSelectQuery, null);
                if (cLogHistoriesCalc.moveToFirst())
                {
                    do
                    {
                        try
                        {
                            sDateBgn = cLogHistoriesCalc.getString(cLogHistoriesCalc.getColumnIndex("date_bgn"));
                            sDateEnd = cLogHistoriesCalc.getString(cLogHistoriesCalc.getColumnIndex("date_end"));

                            if (sDateEnd == null)
                            {
                                sDateEnd = Utility.getCurrentDate(sTimeZoneCity);
                            }
                            else
                            {
                                sDateEnd = cLogHistoriesCalc.getString(cLogHistoriesCalc.getColumnIndex("date_end"));
                            }

                            dDate = dfDateTime.parse(cLogDailiesCalc.getString(cLogDailiesCalc.getColumnIndex("day")));
                            dDateBgn = dfDateTime.parse(sDateBgn);
                            dDateEnd = dfDateTime.parse(sDateEnd);

                            if (dDateBgn.getTime() >= dDate.getTime())
                            {
                            }
                            else
                            {
                                dDateBgn = Utility.getStartOfDay(dDate, sTimeZoneCity);
                                sDateBgn = dfDateTime.format(dDateBgn);
                            }

                            if (dDateEnd.getTime() <= Utility.getEndOfDay(dDate, sTimeZoneCity).getTime())
                            {
                            }
                            else
                            {
                                dDateEnd = Utility.getEndOfDay(dDate, sTimeZoneCity);
                                sDateEnd = dfDateTime.format(dDateEnd);
                            }

                            sEventTypeCode = cLogHistoriesCalc.getString(cLogHistoriesCalc.getColumnIndex("event_type_code"));

                            switch (sEventTypeCode.toUpperCase())
                            {
                                case "OFF":
                                case "PC":
                                    durationsOFF = durationsOFF + Utility.getSeconds(sDateBgn, sDateEnd);
                                    break;

                                case "SB":
                                    durationsSB = durationsSB + Utility.getSeconds(sDateBgn, sDateEnd);
                                    break;

                                case "D":
                                    durationsD = durationsD + Utility.getSeconds(sDateBgn, sDateEnd);
                                    break;

                                case "ON":
                                case "YM":
                                    durationsON = durationsON + Utility.getSeconds(sDateBgn, sDateEnd);
                                    break;
                            }
                        }
                        catch (Exception $e)
                        {
                        }

                    } while (cLogHistoriesCalc.moveToNext());
                }
                cLogHistoriesCalc.close();

                cv.clear();
                cv.put("hours_off_duty", durationsOFF);
                cv.put("hours_sleeper", durationsSB);
                cv.put("hours_driving", durationsD);
                cv.put("hours_on_duty", durationsON);
                cv.put("hours_worked", durationsD + durationsON);

                if ((durationsBaseOFF != durationsOFF) ||
                        (durationsBaseSB != durationsSB) ||
                        (durationsBaseD != durationsD) ||
                        (durationsBaseON != durationsON))
                {
                    Log.d("JWT_DECODED", "HoSFragment log_dailies_id: " + cLogDailiesCalc.getString(cLogDailiesCalc.getColumnIndex("day")));

                    cv.put("upload", 0);
                }
                db.update("log_dailies", cv, "log_dailies_id = '" + cLogDailiesCalc.getString(cLogDailiesCalc.getColumnIndex("log_dailies_id")) + "' ", null);

            } while (cLogDailiesCalc.moveToNext());
        }
        cLogDailiesCalc.close();

        // ***************************************************************
        iCountDay = 0;
        iCountLast7DayWork = 0;
        iRecap8DaysWork = 0;

        // Log dailies
        int iFormManner, iCertified;
        String sViolations;
        String sLogDailies = " SELECT log_dailies_id, day, hours_worked, form_manner, certified, violations " +
                " FROM log_dailies " +
                " WHERE day >= '" + sDay14day + "' " +
                " ORDER BY day desc";

        // Данные из базы --
        Cursor cLogDailies = db.rawQuery(sLogDailies, null);
        if (cLogDailies.moveToFirst())
        {
            do
            {
                if (cLogDailies.getString(cLogDailies.getColumnIndex("form_manner")).compareTo("1") == 0)
                {
                    iFormManner = R.mipmap.check;
                }
                else
                {
                    iFormManner = R.mipmap.cancel;
                }

                if (cLogDailies.getString(cLogDailies.getColumnIndex("certified")).compareTo("1") == 0)
                {
                    iCertified = R.mipmap.check;
                }
                else
                {
                    iCertified = R.mipmap.cancel;
                }

                ciItem = new RecapInfo(iFormManner,
                        iCertified,
                        Utility.getWeek(cLogDailies.getString(cLogDailies.getColumnIndex("day")), sTimeZoneCity),
                        Utility.getDaySuffix(cLogDailies.getString(cLogDailies.getColumnIndex("day"))),
                        cLogDailies.getString(cLogDailies.getColumnIndex("day")),
                        Utility.getHoursOfSeconds(cLogDailies.getInt(cLogDailies.getColumnIndex("hours_worked")), true),
                        cLogDailies.getString(cLogDailies.getColumnIndex("log_dailies_id")),
                        cLogDailies.getString(cLogDailies.getColumnIndex("violations"))
                );
                recapInfoList.add(ciItem);

                if ((iCountDay > 0) && (iCountDay <= 7))
                {
                    iCountLast7DayWork = iCountLast7DayWork + cLogDailies.getInt(cLogDailies.getColumnIndex("hours_worked"));
                }

                if ((iCountDay == 7) && (bResetTimeLast7Day == false))
                {
                    iRecap8DaysWork = iRecap8DaysWork + cLogDailies.getInt(cLogDailies.getColumnIndex("hours_worked"));
                }

                iCountDay++;
            } while (cLogDailies.moveToNext());
        }
        cLogDailies.close();

        tvLast7DaysHoursWorkedHos.setText(localResources.getString(R.string.last_7_days) + " (" + localResources.getString(R.string.hours_worked) + "): " + Utility.getHoursOfSeconds(iCountLast7DayWork, true));
        tvRecap8DaysHoursWorkedHos.setText(localResources.getString(R.string.hours_recap) + ": + "  + Utility.getHoursOfSeconds(iRecap8DaysWork, true));

        mAdapter.notifyDataSetChanged();

        String sLogIntermediate = " SELECT date_bgn, event_type_code " +
                " FROM  log_histories " +
                " WHERE event_sequence_number = (SELECT max(event_sequence_number) " +
                "                                FROM   log_histories " +
                "                               )";

        // Данные из базы --
        Cursor cLogIntermediate = db.rawQuery(sLogIntermediate, null);
        if (cLogIntermediate.moveToFirst())
        {
            do
            {
                if ((cLogIntermediate.getString(cLogIntermediate.getColumnIndex("event_type_code")).compareTo("D") == 0) ||
                        (cLogIntermediate.getString(cLogIntermediate.getColumnIndex("event_type_code")).compareTo("NORMAL_PRECISION") == 0) ||
                        (cLogIntermediate.getString(cLogIntermediate.getColumnIndex("event_type_code")).compareTo("REDUCED_PRECISION") == 0))
                {
                    iTimeIntermediate = Utility.getSeconds(cLogIntermediate.getString(cLogIntermediate.getColumnIndex("date_bgn")), Utility.getCurrentDate(sTimeZoneCity));
                }
                else
                {
                    iTimeIntermediate = 0;
                }

                Log.d("JWT_DECODED_INTER", "iTimeIntermediate: " + iTimeIntermediate);
            } while (cLogIntermediate.moveToNext());
        }
        cLogIntermediate.close();


        // Добавляем в историю авторизацию пользователя
        // Только елси пользователь вышел из приложения принажатие на LogOut
        // Делаю здесь а не LogInActivity - нет даты LogDailies
        if (bAuthorized == false)
        {
            SharedPreferences.Editor edd = myPrefs.edit();
            edd.putBoolean("bAuthorized", true);
            edd.commit();

            Utility.addLogHistories(getContext(),
                    localResources,
                    db,
                    sCompanyId,
                    sDriverId,
                    sCoDriverId,
                    sSelectedVehicleId,
                    sELDId,
                    "LOGIN",
                    "ACTIVE",
                    "AUTO",
                    "AUTOMATIC",
                    "AUTOMATIC",
                    false
            );
        }

        db.close();
    }

    class MyTask extends AsyncTask<String, Integer, Void>
    {

        HoSFragment activity;

        void link(HoSFragment act)
        {
            activity = act;
        }

        protected void onPreExecute()
        {
            super.onPreExecute();
        }

        @SuppressLint("Range")
        protected Void doInBackground(String... items)
        {
            Log.d("JWT_DECODED", "myTask items:" + items[0]);

            if (items[0].toString().compareTo("UploadToServer") == 0)
            {
                mResult mResult = null;
                String sLogDailiesId = "", sLogHistoriesId = "", sLogMapsId = "", sDVIRsId = "";
                SharedPreferences myPrefs = getActivity().getSharedPreferences(getActivity().getPackageName() + "_preferences", Context.MODE_PRIVATE);
                SharedPreferences.Editor edd = myPrefs.edit();
                edd.putString("sError", "");
                edd.commit();

                // подключаемся к БД
                SQLiteDatabase dbA = dbHelper.getWritableDatabase();

                Log.d("JWT_DECODED", "doInBackground");
                try
                {
                    //Отправка данных на сервер
                    //Проверка подключения к интернету
                    ConnectivityManager cm = (ConnectivityManager) getActivity().getSystemService(Context.CONNECTIVITY_SERVICE);
                    NetworkInfo nInfo = cm.getActiveNetworkInfo();
                    if (nInfo != null && nInfo.isConnected())
                    {
                        ContentValues cv = new ContentValues();
                        //------------------------------
                        // Get TimeZone Company
                        //------------------------------
                        String sTimeZoneCity = "";
                        String sTimeZone = " SELECT time_zone_city " +
                                " FROM company " +
                                " WHERE company_id = '" + sCompanyId + "' ";

                        // Данные из базы --
                        Cursor cTimeZone = dbA.rawQuery(sTimeZone, null);
                        if (cTimeZone.moveToFirst())
                        {
                            do
                            {
                                sTimeZoneCity = cTimeZone.getString(cTimeZone.getColumnIndex("time_zone_city"));
                            } while (cTimeZone.moveToNext());
                        }
                        cTimeZone.close();

                        SimpleDateFormat dfDate = new SimpleDateFormat("yyyy-MM-dd'T'HH:mm:ss");
                        String sDate14Days = Utility.getDaysAgo(sTimeZoneCity, -14);
                        String sDateBase;
                        Date dDate14Days, dDateBase;

                        //---------------------------------
                        // Upload DriverStatuses to Server
                        //---------------------------------
                        Log.d("JWT_DECODED", "HoSFragment - Upload DriverStatuses to Server");
                        String sSelectQueryDriverStatuses = " SELECT driver_id, status_duty, location_description, " +
                                " available_break, available_drive, available_shift, available_cycle, last_history_date," +
                                " latitude, longitude " +
                                " FROM driver_statuses " +
                                " WHERE driver_id = '" + sDriverId + "' ";

                        // Данные из базы --
                        Cursor cDriverStatuses = dbA.rawQuery(sSelectQueryDriverStatuses, null);
                        if (cDriverStatuses.moveToFirst())
                        {
                            do
                            {
                                JSONObject obj = new JSONObject();
                                try
                                {
                                    Log.d("JWT_DECODED", "HoSFragment - DriverId: " + cDriverStatuses.getString(cDriverStatuses.getColumnIndex("driver_id")));

                                    obj.put("DriverId", cDriverStatuses.getString(cDriverStatuses.getColumnIndex("driver_id")));
                                    obj.put("StatusDutyCode", cDriverStatuses.getString(cDriverStatuses.getColumnIndex("status_duty")));
                                    obj.put("LocationDescription", cDriverStatuses.getString(cDriverStatuses.getColumnIndex("location_description")));

                                    obj.put("AvailableBreak", cDriverStatuses.getString(cDriverStatuses.getColumnIndex("available_break")));
                                    obj.put("AvailableDrive", cDriverStatuses.getString(cDriverStatuses.getColumnIndex("available_drive")));
                                    obj.put("AvailableShift", cDriverStatuses.getString(cDriverStatuses.getColumnIndex("available_shift")));
                                    obj.put("AvailableCycle", cDriverStatuses.getString(cDriverStatuses.getColumnIndex("available_cycle")));

                                    obj.put("Latitude", cDriverStatuses.getDouble(cDriverStatuses.getColumnIndex("latitude")));
                                    obj.put("Longitude", cDriverStatuses.getDouble(cDriverStatuses.getColumnIndex("longitude")));

                                    obj.put("LastHistoryDate", cDriverStatuses.getString(cDriverStatuses.getColumnIndex("last_history_date")));
                                }
                                catch (JSONException e)
                                {
                                }

                                mResult = requestPOST(localResources.getString(R.string.api_url) + "/eldDashboard/UploadDriverStatuses",
                                        obj.toString());

                            } while (cDriverStatuses.moveToNext());
                        }
                        cDriverStatuses.close();

                        //------------------------------
                        // Upload LogDailies to Server
                        //------------------------------
                        Log.d("JWT_DECODED", "HoSFragment - Upload LogDailies to Server");
                        String sSelectQueryDailies = " SELECT company_id, driver_id, vehicle_id, log_dailies_id, day, " +
                                " hours_off_duty, hours_sleeper, hours_driving, hours_on_duty, hours_worked, " +
                                " violations, form_manner, trailers, shipping_doc, from_address, to_address, certified, certify_timestamp, " +
                                " signature " +
                                " FROM log_dailies WHERE upload = 0 ORDER BY day desc";

                        // Данные из базы --
                        Cursor cLogDailies = dbA.rawQuery(sSelectQueryDailies, null);
                        if (cLogDailies.moveToFirst())
                        {
                            do
                            {
                                JSONObject obj = new JSONObject();
                                try
                                {
                                    sLogDailiesId = cLogDailies.getString(cLogDailies.getColumnIndex("log_dailies_id"));
                                    Log.d("JWT_DECODED", "HoSFragment - sLogDailiesId: " + cLogDailies.getString(cLogDailies.getColumnIndex("day")) + " - " + sLogDailiesId);

                                    obj.put("CompanyId", cLogDailies.getString(cLogDailies.getColumnIndex("company_id")));
                                    obj.put("DriverId", cLogDailies.getString(cLogDailies.getColumnIndex("driver_id")));
                                    obj.put("VehicleId", cLogDailies.getString(cLogDailies.getColumnIndex("vehicle_id")));
                                    obj.put("LogDailiesId", cLogDailies.getString(cLogDailies.getColumnIndex("log_dailies_id")));
                                    obj.put("Day", cLogDailies.getString(cLogDailies.getColumnIndex("day")));
                                    obj.put("HoursOffDuty", cLogDailies.getString(cLogDailies.getColumnIndex("hours_off_duty")));
                                    obj.put("HoursSleeper", cLogDailies.getString(cLogDailies.getColumnIndex("hours_sleeper")));
                                    obj.put("HoursDriving", cLogDailies.getString(cLogDailies.getColumnIndex("hours_driving")));
                                    obj.put("HoursOnDuty", cLogDailies.getString(cLogDailies.getColumnIndex("hours_on_duty")));
                                    obj.put("HoursWorked", cLogDailies.getString(cLogDailies.getColumnIndex("hours_worked")));
                                    obj.put("Violations", cLogDailies.getString(cLogDailies.getColumnIndex("violations")));
                                    obj.put("FormManner", cLogDailies.getString(cLogDailies.getColumnIndex("form_manner")));
                                    obj.put("Trailers", cLogDailies.getString(cLogDailies.getColumnIndex("trailers")));
                                    obj.put("ShippingDoc", cLogDailies.getString(cLogDailies.getColumnIndex("shipping_doc")));
                                    obj.put("FromAddress", cLogDailies.getString(cLogDailies.getColumnIndex("from_address")));
                                    obj.put("ToAddress", cLogDailies.getString(cLogDailies.getColumnIndex("to_address")));
                                    obj.put("Certified", cLogDailies.getString(cLogDailies.getColumnIndex("certified")));
                                    obj.put("CertifyTimestamp", cLogDailies.getString(cLogDailies.getColumnIndex("certify_timestamp")));
                                    obj.put("Signature", cLogDailies.getString(cLogDailies.getColumnIndex("signature")));
                                }
                                catch (JSONException e)
                                {
                                    Log.d("JWT_DECODED", "HoSFragment - sLogDailiesId: " + e.getMessage());

                                }

                                mResult = requestPOST(localResources.getString(R.string.api_url) + "/eldDashboard/UploadLogDailies",
                                        obj.toString());

                                if (mResult.getResultCode() == 0)
                                {
                                    cv.clear();
                                    cv.put("upload", 1);
                                    dbA.update("log_dailies", cv, "log_dailies_id = '" + sLogDailiesId + "' ", null);

                                    // Удаляем данные с телефона старше 14 дней
                                    try
                                    {
                                        sDateBase = cLogDailies.getString(cLogDailies.getColumnIndex("day"));

                                        if (sDateBase == null)
                                        {
                                            sDateBase = Utility.getCurrentDate();
                                        }

                                        dDate14Days = dfDate.parse(sDate14Days);
                                        dDateBase = dfDate.parse(sDateBase);

                                        if (dDateBase.getTime() < dDate14Days.getTime())
                                        {
                                            Log.d("JWT_DECODED", "DELETE log_dailies:" + sLogDailiesId + " " + dDateBase);
                                            dbA.delete("log_dailies", "log_dailies_id = '" + sLogDailiesId + "' ", null);
                                        }
                                    }
                                    catch (Exception $e)
                                    {
                                    }
                                }
                            } while (cLogDailies.moveToNext());
                        }
                        cLogDailies.close();

                        //--------------------------------
                        // Upload LogHistories to Server
                        //--------------------------------
                        Log.d("JWT_DECODED", "HoSFragment - Upload LogHistories to Server");
                        String sSelectQueryHistories = " SELECT log_histories_id, log_dailies_id, driver_id, co_driver_id, " +
                                " vehicle_id, eld_id, date_bgn, date_end, event_sequence_number, " +
                                " event_type_code, country_code, state_province_code, city, event_record_status_code, event_record_origin_code, odometer, hours_engine, " +
                                " latitude, longitude, distance_since, malfunction, data_diagnostic_event, location_description, comment, event_data_check, " +
                                " positioning_code, location_source_code, send_log_to_inspector " +
                                " FROM log_histories WHERE upload = 0 ";

                        // Данные из базы --
                        Cursor cLogHistories = dbA.rawQuery(sSelectQueryHistories, null);
                        if (cLogHistories.moveToFirst())
                        {
                            do
                            {
                                JSONObject obj = new JSONObject();
                                try
                                {
                                    sLogHistoriesId = cLogHistories.getString(cLogHistories.getColumnIndex("log_histories_id"));

                                    Log.d("JWT_DECODED", "HoSFragment - sLogHistoriesId: " + cLogHistories.getString(cLogHistories.getColumnIndex("event_sequence_number"))
                                            + " - " + cLogHistories.getString(cLogHistories.getColumnIndex("date_bgn"))
                                            + " - " + cLogHistories.getString(cLogHistories.getColumnIndex("date_end")));

                                    obj.put("LogHistoriesId", cLogHistories.getString(cLogHistories.getColumnIndex("log_histories_id")));
                                    obj.put("LogDailiesId", cLogHistories.getString(cLogHistories.getColumnIndex("log_dailies_id")));
                                    obj.put("DriverId", cLogHistories.getString(cLogHistories.getColumnIndex("driver_id")));
                                    obj.put("CoDriverId", cLogHistories.getString(cLogHistories.getColumnIndex("co_driver_id")));
                                    obj.put("VehicleId", cLogHistories.getString(cLogHistories.getColumnIndex("vehicle_id")));
                                    obj.put("ELDId", cLogHistories.getString(cLogHistories.getColumnIndex("eld_id")));
                                    obj.put("DateBgn", cLogHistories.getString(cLogHistories.getColumnIndex("date_bgn")));
                                    obj.put("DateEnd", cLogHistories.getString(cLogHistories.getColumnIndex("date_end")));
                                    obj.put("EventSequenceNumber", cLogHistories.getInt(cLogHistories.getColumnIndex("event_sequence_number")));
                                    obj.put("EventTypeCode", cLogHistories.getString(cLogHistories.getColumnIndex("event_type_code")));
                                    obj.put("CountryCode", cLogHistories.getString(cLogHistories.getColumnIndex("country_code")));
                                    obj.put("StateProvinceCode", cLogHistories.getString(cLogHistories.getColumnIndex("state_province_code")));
                                    obj.put("City", cLogHistories.getString(cLogHistories.getColumnIndex("city")));
                                    obj.put("EventRecordStatusCode", cLogHistories.getString(cLogHistories.getColumnIndex("event_record_status_code")));
                                    obj.put("EventRecordOriginCode", cLogHistories.getString(cLogHistories.getColumnIndex("event_record_origin_code")));
                                    obj.put("Odometer", cLogHistories.getInt(cLogHistories.getColumnIndex("odometer")));
                                    obj.put("EngineHours", cLogHistories.getInt(cLogHistories.getColumnIndex("hours_engine")));
                                    obj.put("Latitude", cLogHistories.getDouble(cLogHistories.getColumnIndex("latitude")));
                                    obj.put("Longitude", cLogHistories.getDouble(cLogHistories.getColumnIndex("longitude")));
                                    obj.put("DistanceSince", cLogHistories.getInt(cLogHistories.getColumnIndex("distance_since")));
                                    obj.put("Malfunction", Utility.ConvertIntToBoolean(cLogHistories.getInt(cLogHistories.getColumnIndex("malfunction"))));
                                    obj.put("DataDiagnosticEvent", Utility.ConvertIntToBoolean(cLogHistories.getInt(cLogHistories.getColumnIndex("data_diagnostic_event"))));
                                    obj.put("LocationDescription", cLogHistories.getString(cLogHistories.getColumnIndex("location_description")));
                                    obj.put("Comment", cLogHistories.getString(cLogHistories.getColumnIndex("comment")));
                                    obj.put("EventDataCheck", cLogHistories.getString(cLogHistories.getColumnIndex("event_data_check")));
                                    obj.put("PositioningCode", cLogHistories.getString(cLogHistories.getColumnIndex("positioning_code")));
                                    obj.put("LocationSourceCode", cLogHistories.getString(cLogHistories.getColumnIndex("location_source_code")));
                                    obj.put("SendLogToInspector", Utility.ConvertIntToBoolean(cLogHistories.getInt(cLogHistories.getColumnIndex("send_log_to_inspector"))));
                                }
                                catch (JSONException e)
                                {
                                    Log.d("JWT_DECODED", "JSONException: " + e.getMessage());
                                }

                                mResult = requestPOST(localResources.getString(R.string.api_url) + "/eldDashboard/UploadLogHistories",
                                        obj.toString());

                                if (mResult.getResultCode() == 0)
                                {
                                    cv.clear();
                                    cv.put("upload", 1);
                                    dbA.update("log_histories", cv, "log_histories_id = '" + sLogHistoriesId + "' ", null);

                                    // Удаляем данные с телефона старше 14 дней
                                    try
                                    {
                                        sDateBase = cLogHistories.getString(cLogHistories.getColumnIndex("date_end"));

                                        if (sDateBase == null)
                                        {
                                            sDateBase = Utility.getCurrentDate();
                                        }

                                        dDate14Days = dfDate.parse(sDate14Days);
                                        dDateBase = dfDate.parse(sDateBase);

                                        if (dDateBase.getTime() < dDate14Days.getTime())
                                        {
                                            Log.d("JWT_DECODED", "DELETE sLogHistoriesId:" + sLogHistoriesId + " " + dDateBase);
                                            dbA.delete("log_histories", "log_histories_id = '" + sLogHistoriesId + "' ", null);
                                        }
                                    }
                                    catch (Exception e)
                                    {
                                        Log.d("JWT_DECODED_EX", "DELETE sLogHistoriesId:" + sLogHistoriesId + " " + e.getMessage());
                                    }
                                }
                                else
                                {
                                    Log.d("JWT_DECODED", "requestPOST: " + mResult.getResultCode() + " " + mResult.getResultMessage());
                                    Log.d("JWT_DECODED", "requestPOST obj: " + obj.toString());
                                }
                            } while (cLogHistories.moveToNext());
                        }
                        cLogHistories.close();

                        //--------------------------------
                        // Upload LogMaps to Server
                        //--------------------------------
                        Log.d("JWT_DECODED", "HoSFragment - Upload LogMaps to Server");
                        String sSelectQueryMaps = String.format("SELECT log_maps_id, driver_id, vehicle_id, date_log, country_code, " +
                                " state_province_code, city,  latitude, longitude, distance_since, speed, location_description " +
                                " FROM log_maps WHERE upload = 0 ");

                        // Данные из базы --
                        Cursor cLogMaps = dbA.rawQuery(sSelectQueryMaps, null);
                        if (cLogMaps.moveToFirst())
                        {
                            do
                            {
                                JSONObject obj = new JSONObject();
                                try
                                {
                                    sLogMapsId = cLogMaps.getString(cLogMaps.getColumnIndex("log_maps_id"));

                                    Log.d("JWT_DECODED", "HoSFragment - sLogHistoriesId: " + cLogMaps.getString(cLogMaps.getColumnIndex("log_maps_id"))
                                            + " - " + cLogMaps.getString(cLogMaps.getColumnIndex("date_log")));

                                    obj.put("LogMapsId", cLogMaps.getString(cLogMaps.getColumnIndex("log_maps_id")));
                                    obj.put("DriverId", cLogMaps.getString(cLogMaps.getColumnIndex("driver_id")));
                                    obj.put("VehicleId", cLogMaps.getString(cLogMaps.getColumnIndex("vehicle_id")));
                                    obj.put("DateLog", cLogMaps.getString(cLogMaps.getColumnIndex("date_log")));
                                    obj.put("CountryCode", cLogMaps.getString(cLogMaps.getColumnIndex("country_code")));
                                    obj.put("StateProvinceCode", cLogMaps.getString(cLogMaps.getColumnIndex("state_province_code")));
                                    obj.put("City", cLogMaps.getString(cLogMaps.getColumnIndex("city")));
                                    obj.put("Latitude", cLogMaps.getString(cLogMaps.getColumnIndex("latitude")));
                                    obj.put("Longitude", cLogMaps.getString(cLogMaps.getColumnIndex("longitude")));
                                    obj.put("DistanceSince", CheckNullValue(cLogMaps.getString(cLogMaps.getColumnIndex("distance_since"))));
                                    obj.put("Speed", CheckNullValue(cLogMaps.getString(cLogMaps.getColumnIndex("speed"))));
                                    obj.put("LocationDescription", cLogMaps.getString(cLogMaps.getColumnIndex("location_description")));
                                }
                                catch (JSONException e)
                                {
                                    Log.d("JWT_DECODED", "JSONException: " + e.getMessage());
                                }

                                mResult = requestPOST(localResources.getString(R.string.api_url) + "/eldDashboard/UploadLogMaps",
                                        obj.toString());

                                if (mResult.getResultCode() == 0)
                                {
                                    /*cv.clear();
                                    cv.put("upload", 1);
                                    dbA.update("log_maps", cv, "log_maps_id = '" + sLogMapsId + "' ", null);
                                    */
                                    dbA.delete("log_maps", "log_maps_id = '" + sLogMapsId + "' ", null);
                                }
                            } while (cLogMaps.moveToNext());
                        }
                        cLogMaps.close();

                        //--------------------------
                        // Upload DVIRs to Server
                        //-------------------------
                        String sSelectQueryDVIRs = " SELECT dvir_id, create_date, driver_id, vehicle_id, trailers, odometer, " +
                                " defects_vehicle, defects_trailers, remarks, latitude, longitude, dvir_status_code, location_description,  " +
                                " signature, mechanic_signature, repair_date " +
                                " FROM dvirs WHERE upload = 0 ";

                        // Данные из базы --
                        Cursor cLogDVIRs = dbA.rawQuery(sSelectQueryDVIRs, null);
                        if (cLogDVIRs.moveToFirst())
                        {
                            do
                            {
                                JSONObject obj = new JSONObject();
                                try
                                {
                                    sDVIRsId = cLogDVIRs.getString(cLogDVIRs.getColumnIndex("dvir_id"));

                                    Log.d("JWT_DECODED", "HoSFragment - dvir_id: " + cLogDVIRs.getString(cLogDVIRs.getColumnIndex("dvir_id"))
                                            + " - " + cLogDVIRs.getString(cLogDVIRs.getColumnIndex("create_date")));

                                    obj.put("DvirId", cLogDVIRs.getString(cLogDVIRs.getColumnIndex("dvir_id")));
                                    obj.put("CreateDate", cLogDVIRs.getString(cLogDVIRs.getColumnIndex("create_date")));
                                    obj.put("DriverId", cLogDVIRs.getString(cLogDVIRs.getColumnIndex("driver_id")));
                                    obj.put("VehicleId", cLogDVIRs.getString(cLogDVIRs.getColumnIndex("vehicle_id")));
                                    obj.put("Trailers", cLogDVIRs.getString(cLogDVIRs.getColumnIndex("trailers")));
                                    obj.put("Odometer", cLogDVIRs.getString(cLogDVIRs.getColumnIndex("odometer")));
                                    obj.put("DefectsVehicle", cLogDVIRs.getString(cLogDVIRs.getColumnIndex("defects_vehicle")));
                                    obj.put("DefectsTrailers", cLogDVIRs.getString(cLogDVIRs.getColumnIndex("defects_trailers")));
                                    obj.put("Remarks", cLogDVIRs.getString(cLogDVIRs.getColumnIndex("remarks")));
                                    obj.put("DvirStatusCode", cLogDVIRs.getString(cLogDVIRs.getColumnIndex("dvir_status_code")));
                                    obj.put("Latitude", cLogDVIRs.getString(cLogDVIRs.getColumnIndex("latitude")));
                                    obj.put("Longitude", cLogDVIRs.getString(cLogDVIRs.getColumnIndex("longitude")));
                                    obj.put("LocationDescription", cLogDVIRs.getString(cLogDVIRs.getColumnIndex("location_description")));
                                    obj.put("Signature", cLogDVIRs.getString(cLogDVIRs.getColumnIndex("signature")));
                                    obj.put("MechanicSignature", cLogDVIRs.getString(cLogDVIRs.getColumnIndex("mechanic_signature")));
                                    obj.put("RepairDate", cLogDVIRs.getString(cLogDVIRs.getColumnIndex("repair_date")));
                                }
                                catch (JSONException e)
                                {
                                    Log.d("JWT_DECODED", "JSONException: " + e.getMessage());
                                }

                                mResult = requestPOST(localResources.getString(R.string.api_url) + "/eldDashboard/UploadDVIR",
                                        obj.toString());

                                if (mResult.getResultCode() == 0)
                                {
                                    cv.clear();
                                    cv.put("upload", 1);
                                    dbA.update("dvirs", cv, "dvir_id = '" + sDVIRsId + "' ", null);

                                    //dbA.delete("log_maps", "log_maps_id = '" + sLogMapsId + "' ", null);
                                }
                            } while (cLogDVIRs.moveToNext());
                        }
                        cLogDVIRs.close();


                        dbA.close();
                    }
                }
                catch (Exception e)
                {
                    Log.d("JWT_DECODED", "doInBackground Exception" + e.getMessage());
                    e.printStackTrace();
                }
                finally
                {
                    dbA.close();
                }
            }

            //***********************************************************************
            else if (items[0].toString().compareTo("GetSpeed") == 0)
            {
                try
                {
                    SharedPreferences myPrefs = getActivity().getSharedPreferences(getActivity().getPackageName() + "_preferences", Context.MODE_PRIVATE);
                    String sMACAddressMyTask = myPrefs.getString("sMACAddress", "");

                    Log.d("JWT_DECODED", "GetSpeed Runnable..");
                    Log.d("JWT_DECODED", "sMACAddress: " + sMACAddressMyTask);

                    if (sMACAddressMyTask.trim().length() > 0)
                    {
                        Log.d("JWT_DECODED", "sock: " + activity.bSock);

                        if (activity.bSock == null)
                        {
                            Log.d("JWT_DECODED", "connetcted!");

                            if ((Build.VERSION.SDK_INT >= Build.VERSION_CODES.S) &&
                                    (ActivityCompat.checkSelfPermission(getContext(), Manifest.permission.BLUETOOTH_CONNECT) != PackageManager.PERMISSION_GRANTED))
                            { }
                            else
                            {
                                final BluetoothAdapter btAdapter = BluetoothAdapter.getDefaultAdapter();
                                activity.bDev = btAdapter.getRemoteDevice(sMACAddressMyTask);
                                btAdapter.cancelDiscovery();

                                activity.bSock = MyBluetoothManager.connect(activity.bDev, getContext());

                                Log.d("JWT_DECODED", "ObdResetCommand!");
                                new ObdResetCommand().run(activity.bSock.getInputStream(), activity.bSock.getOutputStream());

                                Log.d("JWT_DECODED", "EchoOffCommand!");
                                new EchoOffCommand().run(activity.bSock.getInputStream(), activity.bSock.getOutputStream());

                                Log.d("JWT_DECODED", "LineFeedOffCommand!");
                                new LineFeedOffCommand().run(activity.bSock.getInputStream(), activity.bSock.getOutputStream());

                                //Log.d("JWT_DECODED", "TimeoutCommand!");
                                //new TimeoutCommand().run(activity.bSock.getInputStream(), activity.bSock.getOutputStream());

                                Log.d("JWT_DECODED", "SelectProtocolCommand!");
                                new SelectProtocolCommand(ObdProtocols.AUTO).run(activity.bSock.getInputStream(), activity.bSock.getOutputStream());
                            }
                        }
                    }
                }
                catch (Exception e)
                {
                    e.printStackTrace();
                    Log.d("JWT_DECODED_EXCEPTION", "Exception Connected BluetoothAdapter: " + e.getMessage());
                    try {
                        if (activity.bSock != null)
                        {
                            try
                            {
                                activity.bSock.close();
                            }
                            catch (Exception e2) { }
                            activity.bSock = null;
                        }
                    }
                    catch (Exception e2) { }
                }

                try
                {
                    dSpeed = 0.0;
                    if (activity.bSock != null)
                    {
                        if(activity.bSock.isConnected())
                        {
                            Log.d("JWT_DECODED", "sock: " + activity.bSock.isConnected());

                            try {
                                DistanceMILOnCommand distanceMILOnCommand = new DistanceMILOnCommand();
                                distanceMILOnCommand.useImperialUnits(true);
                                distanceMILOnCommand.run(activity.bSock.getInputStream(), activity.bSock.getOutputStream());

                                try
                                {
                                    Log.d("JWT_DECODED", "DistanceMILOn getName: " + distanceMILOnCommand.getName() );
                                }
                                catch (Exception e){}

                                try
                                {
                                    Log.d("JWT_DECODED", "DistanceMILOn getCalculatedResult: " + distanceMILOnCommand.getCalculatedResult() );
                                }
                                catch (Exception e){}

                                Log.d("JWT_DECODED", "DistanceMILOn getFormattedResult: " + distanceMILOnCommand.getFormattedResult());
                            } catch (Exception e) {
                                e.printStackTrace();
                                Log.d("JWT_DECODED_EXCEPTION", "DistanceMILOn: " + e.getMessage());
                            }

                            try {
                                DistanceSinceCCCommand distanceSinceCCCommand = new DistanceSinceCCCommand();
                                distanceSinceCCCommand.useImperialUnits(true);
                                distanceSinceCCCommand.run(activity.bSock.getInputStream(), activity.bSock.getOutputStream());

                                try
                                {
                                    Log.d("JWT_DECODED", "DistanceSinceCC getCalculatedResult: " + distanceSinceCCCommand.getCalculatedResult());
                                }
                                catch (Exception e){}

                                Log.d("JWT_DECODED", "DistanceSinceCC getFormattedResult: " + distanceSinceCCCommand.getFormattedResult());
                            } catch (Exception e) {
                                e.printStackTrace();
                                Log.d("JWT_DECODED_EXCEPTION", "DistanceSinceCC: " + e.getMessage());
                            }

                            try {
                                OdometerCommand odometerCommand = new OdometerCommand();
                                odometerCommand.run(activity.bSock.getInputStream(), activity.bSock.getOutputStream());

                                try
                                {
                                    Log.d("JWT_DECODED", "odometerCommand getCalculatedResult: " + odometerCommand.getCalculatedResult());
                                }
                                catch (Exception e){}

                                Log.d("JWT_DECODED", "odometerCommand getFormattedResult: " + odometerCommand.getFormattedResult());
                            } catch (Exception e) {
                                e.printStackTrace();
                                Log.d("JWT_DECODED_EXCEPTION", "odometerCommand: " + e.getMessage());
                            }


                            try {
                                VinCommand vinCommand = new VinCommand();
                                vinCommand.run(activity.bSock.getInputStream(), activity.bSock.getOutputStream());

                                try
                                {
                                    Log.d("JWT_DECODED", "VinCommand getCalculatedResult: " + vinCommand.getCalculatedResult());
                                }
                                catch (Exception e){}

                                Log.d("JWT_DECODED", "VinCommand getFormattedResult: " + vinCommand.getFormattedResult());
                            } catch (Exception e) {
                                e.printStackTrace();
                                Log.d("JWT_DECODED_EXCEPTION", "VinCommand: " + e.getMessage());
                            }

                            // Calculated Engine Load value
                            try {
                                LoadCommand loadCommand  = new LoadCommand ();
                                loadCommand.run(activity.bSock.getInputStream(), activity.bSock.getOutputStream());

                                try
                                {
                                    Log.d("JWT_DECODED", "LoadCommand getCalculatedResult: " + loadCommand.getCalculatedResult() );
                                }
                                catch (Exception e){}

                                Log.d("JWT_DECODED", "LoadCommand getName: " + loadCommand.getName());

                                Log.d("JWT_DECODED", "LoadCommand getFormattedResult: " + loadCommand.getFormattedResult());
                            } catch (Exception e) {
                                e.printStackTrace();
                                Log.d("JWT_DECODED_EXCEPTION", "LoadCommand: " + e.getMessage());
                            }

                            // Engine runtime
                            try {
                                RuntimeCommand runtimeCommand = new RuntimeCommand();
                                runtimeCommand.useImperialUnits(true);
                                runtimeCommand.run(activity.bSock.getInputStream(), activity.bSock.getOutputStream());

                                try
                                {
                                    Log.d("JWT_DECODED", "RuntimeCommand getCalculatedResult: " + runtimeCommand.getCalculatedResult());
                                }
                                catch (Exception e){}


                                Log.d("JWT_DECODED", "RuntimeCommand getFormattedResult: " + runtimeCommand.getFormattedResult());
                            } catch (Exception e) {
                                e.printStackTrace();
                                Log.d("JWT_DECODED_EXCEPTION", "RuntimeCommand: " + e.getMessage());
                            }

                            try
                            {
                                SpeedCommand speedCommand = new SpeedCommand();
                                speedCommand.useImperialUnits(true);
                                speedCommand.run(activity.bSock.getInputStream(), activity.bSock.getOutputStream());

                                try
                                {
                                    Log.d("JWT_DECODED_SPEED", "Speed: " + speedCommand.getName());
                                }
                                catch (Exception e){}

                                try
                                {
                                    Log.d("JWT_DECODED_SPEED", "Speed: " + speedCommand.getImperialSpeed());
                                }
                                catch (Exception e){}

                                try
                                {
                                    Log.d("JWT_DECODED_SPEED", "Speed: " + speedCommand.getCalculatedResult());
                                }
                                catch (Exception e){}

                                try
                                {
                                    Log.d("JWT_DECODED_SPEED", "Speed: " + speedCommand.getFormattedResult());
                                }
                                catch (Exception e){}



                                dSpeed = Double.parseDouble(speedCommand.getCalculatedResult());
                            }
                            catch (SocketTimeoutException ste)
                            {
                                dSpeed = -1.0;
                                ste.printStackTrace();
                                Log.d("JWT_DECODED_EXCEPTION", "SocketTimeoutException speedCommand: " + ste.getMessage());
                            }
                            catch (IOException ioe)
                            {
                                Log.d("JWT_DECODED", "bSock.close()");
                                if (activity.bSock != null)
                                {
                                    activity.bSock.close();
                                    activity.bSock = null;
                                }

                                ioe.printStackTrace();
                                Log.d("JWT_DECODED_EXCEPTION", "IOException speedCommand: " + ioe.getMessage());
                            }
                            catch (Exception e)
                            {
                                Log.d("JWT_DECODED", "bSock.close()");
                                if (activity.bSock != null)
                                {
                                    activity.bSock.close();
                                    activity.bSock = null;
                                }

                                e.printStackTrace();
                                Log.d("JWT_DECODED_EXCEPTION", "Exception speedCommand: " + e.getMessage());
                            }
                        }
                        else
                        {
                            Log.d("JWT_DECODED", "bSock.close()");
                            if (activity.bSock != null)
                            {
                                try
                                {
                                    activity.bSock.close();
                                }
                                catch (Exception e)
                                {
                                    e.printStackTrace();
                                    Log.d("JWT_DECODED_EXCEPTION", "Exception bSock close: " + e.getMessage());
                                }
                                activity.bSock = null;
                            }
                        }
                    }

                    switch (activity.sEventTypeCode) {
                        case "PC":

                            break;

                        case "OFF":
                        case "SB":
                        case "ON":
                            Log.d("JWT_DECODED_SPEED", "dSpeed ON: " + dSpeed);
                            iContinueDriving = 2;
                            iTimeNotDrive = 0;
                            if (dSpeed > 5.0) {
                                Log.d("JWT_DECODED_SPEED", "addLogHistories");
                                activity.sEventTypeCode = "D";

                                // подключаемся к БД и сохраниения статуса
                                publishProgress(1);
                            }
                            break;

                        case "D":
                        case "YM":
                            if (dSpeed == 0)
                            {
                                Log.d("JWT_DECODED_SPEED", "iTimeNotDrive:" + iTimeNotDrive);
                                if ((iTimeNotDrive >= 1) && (iContinueDriving == 0))
                                {
                                    Log.d("JWT_DECODED_SPEED", "addLogHistories");
                                    iTimeNotDrive = 0;
                                    iContinueDriving = 2;
                                    activity.sEventTypeCode = "ON";

                                    // подключаемся к БД и сохраниения статуса
                                    publishProgress(2);
                                }
                            }
                            else
                            {
                                iContinueDriving = 2;
                                iTimeNotDrive = 0;
                            }
                            break;
                    }

                }
                catch (Exception e) {
                    e.printStackTrace();
                    Log.d("JWT_DECODED_EXCEPTION", "Exception Check Speed: " + e.getMessage());
                }
            }

            //***********************************************************************
            else if (items[0].toString().compareTo("MapTracing") == 0)
            {
                publishProgress(3);
            }

            //***********************************************************************
            else if (items[0].toString().compareTo("Intermediate") == 0)
            {
                publishProgress(4);
            }

            return null;
        }

        protected void onProgressUpdate(Integer... items)
        {
            super.onProgressUpdate(items);

            // StatusDuty Driving
            if (items[0] == 1)
            {
                try
                {
                    // подключаемся к БД
                    SQLiteDatabase db = activity.dbHelper.getWritableDatabase();
                    Utility.addLogHistories(activity.getContext(),
                            activity.localResources,
                            db,
                            activity.sCompanyId,
                            activity.sDriverId,
                            activity.sCoDriverId,
                            activity.sSelectedVehicleId,
                            activity.sELDId,
                            "D",
                            "ACTIVE",
                            "AUTO",
                            "AUTOMATIC",
                            "AUTOMATIC",
                            true
                    );
                    db.close();
                }
                catch (Exception e)
                {
                    Log.d("JWT_DECODED_SPEED", "Exception addLogHistories D: " + e.getMessage());
                }

                activity.iRefreshHandler = 1;
            }

            // StatusDuty OnDuty
            if (items[0] == 2)
            {
                try
                {
                    // подключаемся к БД
                    SQLiteDatabase db = activity.dbHelper.getWritableDatabase();
                    Utility.addLogHistories(activity.getContext(),
                            activity.localResources,
                            db,
                            activity.sCompanyId,
                            activity.sDriverId,
                            activity.sCoDriverId,
                            activity.sSelectedVehicleId,
                            activity.sELDId,
                            "ON",
                            "ACTIVE",
                            "AUTO",
                            "AUTOMATIC",
                            "AUTOMATIC",
                            true
                    );
                    db.close();
                }
                catch (Exception e)
                {
                    e.printStackTrace();
                    Log.d("JWT_DECODED_SPEED", "Exception addLogHistories ON1: " + e.getMessage());

                }

                activity.iRefreshHandler = 1;
            }

            // MapTracing
            if (items[0] == 3)
            {
                try
                {
                    // подключаемся к БД
                    SQLiteDatabase db = activity.dbHelper.getWritableDatabase();
                    Utility.addLogMaps(activity.getContext(),
                            db,
                            activity.sCompanyId,
                            activity.sDriverId,
                            activity.sSelectedVehicleId,
                            activity.dSpeed
                    );
                    db.close();
                }
                catch (Exception e)
                {
                    e.printStackTrace();
                    Log.d("JWT_DECODED_SPEED", "Exception addLogMaps: " + e.getMessage());
                }
            }

            // Intermediate
            if (items[0] == 4)
            {
                try
                {
                    // подключаемся к БД
                    SQLiteDatabase db = activity.dbHelper.getWritableDatabase();
                    Utility.addLogHistories(activity.getContext(),
                            activity.localResources,
                            db,
                            activity.sCompanyId,
                            activity.sDriverId,
                            activity.sCoDriverId,
                            activity.sSelectedVehicleId,
                            activity.sELDId,
                            "NORMAL_PRECISION",
                            "ACTIVE",
                            "AUTO",
                            "AUTOMATIC",
                            "AUTOMATIC",
                            false
                    );
                    db.close();
                }
                catch (Exception e)
                {
                    e.printStackTrace();
                    Log.d("JWT_DECODED_SPEED", "Exception addLogMaps: " + e.getMessage());
                }
            }
        }

        protected void onPostExecute(Void items) {
            super.onPostExecute(items);
            activity.myTask = null;

            // Таймер - 1 секунды
            //timerHandler.postDelayed(timerRunnable, 1000);
        }
    }

    public mResult requestPOST(String sURL, String sBody)
    {
        int iResultCode;
        String sResultMessage, sAccessToken;

        HttpURLConnection connectionSync = null;
        try
        {
            SharedPreferences myPrefs = getActivity().getSharedPreferences(getActivity().getPackageName() + "_preferences", Context.MODE_PRIVATE);
            sAccessToken              = myPrefs.getString("sAccessToken", "en");

            // Created URL for connection.
            URL urlAuth = new URL(sURL);

            String requestAuth = sBody;

            // Input data setup
            byte[] postDataAuth = requestAuth.getBytes(StandardCharsets.UTF_8);
            int postDataLengthAuth = postDataAuth.length;

            // Created connection
            connectionSync = (HttpURLConnection) urlAuth.openConnection();
            connectionSync.setDoOutput(true);
            connectionSync.setInstanceFollowRedirects(false);
            connectionSync.setRequestMethod("POST");
            connectionSync.setRequestProperty("Authorization","Bearer " + sAccessToken);
            connectionSync.setRequestProperty("Content-Type", "application/json");
            connectionSync.setRequestProperty("charset", "utf-8");
            connectionSync.setRequestProperty("Content-Length", Integer.toString(postDataLengthAuth));
            connectionSync.setUseCaches(false);

            // Loaded inputs
            DataOutputStream wrAuth = new DataOutputStream(connectionSync.getOutputStream());
            wrAuth.write(postDataAuth);
            wrAuth.flush();
            wrAuth.close();

            // Getting a response
            int responseCodeAuth = connectionSync.getResponseCode();
            if (responseCodeAuth == HttpURLConnection.HTTP_OK) {
                // Read response
                iResultCode = 0;
                sResultMessage = convertStreamToString(connectionSync.getInputStream());
            }
            else
            {
                // Read Error
                iResultCode = -1;
                sResultMessage = "API: " + sURL + " - " + connectionSync.getResponseMessage() + " - " + convertStreamToString(connectionSync.getInputStream());
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

    private String CheckNullValue(String Value)
    {
        if(Value != null && !Value .isEmpty())
        {
            return Value;
        }
        else
        {
            return "0";
        }
    }

    private void CheckRestMode(int ipBreakReset,
                               int ipBreakResetFull,
                               int ipShiftReset,
                               int ipShiftResetFull,
                               int ipCycleReset,
                               int ipCycleResetFull)
    {
        if (bRestMode == false)
        {
            llLineBDSCHos.setVisibility(View.VISIBLE);
            llLineResetHos.setVisibility(View.GONE);

            ibRestModeHos.setImageResource(R.drawable.ic_rest_mode);
            tvRestModeHos.setText(localResources.getString(R.string.rest_mode));
        }
        else
        {
            llLineBDSCHos.setVisibility(View.GONE);
            llLineResetHos.setVisibility(View.VISIBLE);

            if (ipBreakReset < 0) { ipBreakReset = 0; }
            if (ipShiftReset < 0) { ipShiftReset = 0; }
            if (ipCycleReset < 0) { ipCycleReset = 0; }

            tvMinimumBreakRequiredHos.setText(localResources.getString(R.string.minimum_break_required));
            tvMinimumBreakRequiredTimeHos.setText(Utility.getHoursOfSeconds(ipBreakReset, false)  + " / " + Utility.getHoursOfSeconds(ipBreakResetFull, false));
            pbMinimumBreakRequiredHos.setProgress(100 * ipBreakReset / (30 * 60));

            tvUntilShiftResetHos.setText(localResources.getString(R.string.until_shift_reset));
            tvUntilShiftResetTimeHos.setText(Utility.getHoursOfSeconds(ipShiftReset, false)  + " / " + Utility.getHoursOfSeconds(ipShiftResetFull, false));
            pbUntilShiftResetHos.setProgress(100 * ipShiftReset / (10 * 60 * 60));

            tvUntilCycleResetHos.setText(localResources.getString(R.string.until_cycle_reset));
            tvUntilCycleResetTimeHos.setText(Utility.getHoursOfSeconds(ipCycleReset, false)  + " / " + Utility.getHoursOfSeconds(ipCycleResetFull, false));
            pbUntilCycleResetHos.setProgress(100 * ipCycleReset / (34 * 60 * 60));

            ibRestModeHos.setImageResource(R.drawable.ic_vehicle);
            tvRestModeHos.setText(localResources.getString(R.string.drive_mode));
        }
    }

    private void CheckSplitSleeperBerth(boolean bpSplitSleeperBerth)
    {
        if (bpSplitSleeperBerth == true)
        {
            tvSSBDrivePercentHos.setVisibility(View.VISIBLE);
            tvSSBShiftPercentHos.setVisibility(View.VISIBLE);
        }
        else
        {
            tvSSBDrivePercentHos.setVisibility(View.GONE);
            tvSSBShiftPercentHos.setVisibility(View.GONE);
        }
    }

    private void CheckGPS(boolean bDisplayMessage)
    {
        if (locationManager.isProviderEnabled(LocationManager.GPS_PROVIDER))
        {
            // Enabled
            if(bDisplayMessage)
            {
                Toast.makeText(getActivity(), "GPS is already Enabled", Toast.LENGTH_SHORT).show();
            }
        }
        else
        {
            // Disabled
            // Диалоговое окно с разрешением на включение GPS
            try
            {
                LocationRequest locationRequest = LocationRequest.create();
                locationRequest.setPriority(LocationRequest.PRIORITY_HIGH_ACCURACY);
                LocationSettingsRequest.Builder builder = new LocationSettingsRequest.Builder().addLocationRequest(locationRequest);

                // This displays dialog box like Google Maps with two buttons - OK and NO, THANKS
                builder.setAlwaysShow(true);
                Task<LocationSettingsResponse> task = LocationServices.getSettingsClient(getActivity()).checkLocationSettings(builder.build());

                task.addOnCompleteListener(new OnCompleteListener<LocationSettingsResponse>()
                {
                    @Override
                    public void onComplete(Task<LocationSettingsResponse> task)
                    {
                        try
                        {
                            task.getResult(ApiException.class);
                            // All location settings are satisfied. The client can initialize location
                            // requests here.
                        }
                        catch (ApiException exception)
                        {
                            switch (exception.getStatusCode())
                            {
                                case LocationSettingsStatusCodes.RESOLUTION_REQUIRED:
                                    // Location settings are not satisfied. But could be fixed by showing the
                                    // user a dialog.
                                    try
                                    {
                                        // Cast to a resolvable exception.
                                        ResolvableApiException resolvable = (ResolvableApiException) exception;
                                        // Show the dialog by calling startResolutionForResult(),
                                        // and check the result in onActivityResult().
                                        resolvable.startResolutionForResult(getActivity(), REQUEST_CHECK_SETTINGS);
                                    }
                                    catch (IntentSender.SendIntentException e)
                                    {
                                        // Ignore the error.
                                    }
                                    catch (ClassCastException e)
                                    {
                                        // Ignore, should be an impossible error.
                                    }
                                    break;

                                case LocationSettingsStatusCodes.SETTINGS_CHANGE_UNAVAILABLE:
                                    // Location settings are not satisfied. However, we have no way to fix the
                                    // settings so we won't show the dialog.
                                    break;
                            }
                        }
                    }
                });
            }
            catch (Exception e)
            {
                // Ignore the error.
            }
        }
    }

    public void CheckBluetooth()
    {
        try
        {
            BluetoothAdapter btAdapter = BluetoothAdapter.getDefaultAdapter();
            if (!btAdapter.isEnabled())
            {
                if ((Build.VERSION.SDK_INT >= Build.VERSION_CODES.S) &&
                        (ActivityCompat.checkSelfPermission(getContext(), Manifest.permission.BLUETOOTH_CONNECT) != PackageManager.PERMISSION_GRANTED))
                {

                }
                else
                {
                    btAdapter.enable();
                }
            }
        }
        catch (Exception e)
        {
        }
    }

    public void onClick(View v)
    {
        Intent intentSet = new Intent();
        SharedPreferences myPrefs;
        SharedPreferences.Editor edd;

        // по id определеяем кнопку, вызвавшую этот обработчик
        switch (v.getId()) {
            case R.id.iibGPSHoS:
                CheckGPS(true);
                break;

            case R.id.iibBluetoothHoS:
                bOpenELDActivity = true;
                if (bSock != null)
                {
                    try
                    {
                        bSock.close();
                    }
                    catch (Exception e) {}
                    bSock = null;
                }

                myPrefs = getActivity().getSharedPreferences(getActivity().getPackageName() + "_preferences", Context.MODE_PRIVATE);
                edd = myPrefs.edit();
                edd.putString("sIntentELD", "HoSFragment");
                edd.commit();

                intentSet.setClass(getContext(), ELDActivity.class);
                startActivity(intentSet);
                getActivity().overridePendingTransition(R.anim.slide_left_in, R.anim.slide_left_out);

                break;

            case R.id.itvCurrentStatusHos:
            case R.id.iibCurrentStatusHos:

                intentSet.setClass(getContext(), SelectDutyStatusActivity.class);
                startActivity(intentSet);
                getActivity().overridePendingTransition(R.anim.slide_left_in, R.anim.slide_left_out);

                break;

            case R.id.ibDrivingHos:
                iContinueDriving = 1;
                llContinueDrivingHos.setVisibility(View.GONE);
                break;

            case R.id.ibOnDutyHos:
                iContinueDriving = 0;
                llContinueDrivingHos.setVisibility(View.GONE);

                try
                {
                    // подключаемся к БД
                    SQLiteDatabase db = dbHelper.getWritableDatabase();
                    Utility.addLogHistories(getContext(),
                            localResources,
                            db,
                            sCompanyId,
                            sDriverId,
                            sCoDriverId,
                            sSelectedVehicleId,
                            sELDId,
                            "ON",
                            "ACTIVE",
                            "AUTO",
                            "AUTOMATIC",
                            "AUTOMATIC",
                            true
                    );
                    db.close();
                }
                catch (Exception e) { }
                iRefreshHandler = 1;

                break;

            case R.id.illRestModeHos:
                if (bRestMode == false)
                {
                    bRestMode = true;
                }
                else
                {
                    bRestMode = false;
                }
                LoadDate();

                break;

            case R.id.isSplitSleeperBerth:
                myPrefs = getActivity().getSharedPreferences(getActivity().getPackageName() + "_preferences", Context.MODE_PRIVATE);
                edd = myPrefs.edit();
                edd.putBoolean("bSplitSleeperBerth", sSplitSleeperBerth.isChecked());
                edd.commit();

                CheckSplitSleeperBerth(sSplitSleeperBerth.isChecked());
                break;
        }
    }

    public void onPause() {
        super.onPause();
        locationManager.removeUpdates(locationListener);
    }

    public void onResume() {
        super.onResume();

        bOpenELDActivity = false;
        if (iRefresh == 1)
        {
            iCountTime = 60;
            try
            {
                LoadDate();
            }
            catch (Exception e) { }
        }

        if (ActivityCompat.checkSelfPermission(getContext(), Manifest.permission.ACCESS_FINE_LOCATION) != PackageManager.PERMISSION_GRANTED &&
            ActivityCompat.checkSelfPermission(getContext(), Manifest.permission.ACCESS_COARSE_LOCATION) != PackageManager.PERMISSION_GRANTED)
        { }
        else
        {
            locationManager.requestLocationUpdates(LocationManager.GPS_PROVIDER, 1000 * 10, 10, locationListener);
            locationManager.requestLocationUpdates(LocationManager.NETWORK_PROVIDER, 1000 * 10, 10, locationListener);
            //checkEnabled();
        }
    }

    public void onDestroy() {
        super.onDestroy();

        Log.d("JWT_DECODED_CYCLE", "HOS onDestroy");
        timerHandler.removeCallbacks(timerRunnable);

        // close socket
        if (bSock != null)
        {
            try
            {
                bSock.close();
                bSock = null;
            }
            catch (IOException e) { }
        }

        /*final BluetoothAdapter btAdapter = BluetoothAdapter.getDefaultAdapter();
        if (btAdapter != null && btAdapter.isEnabled() && !bluetoothDefaultIsEnable)
            btAdapter.disable();*/
    }
/*
    @Override
    public void onDetach() {
        super.onDetach();

        AlertDialog.Builder builder = new AlertDialog.Builder(getContext(), R.style.AlertDialogTheme);
        builder
                .setMessage(localResources.getString(R.string.yard_moves))
                // РєРЅРѕРїРєР° "Yes", РїСЂРё РЅР°Р¶Р°С‚РёРё РЅР° РєРѕС‚РѕСЂСѓСЋ РїСЂРёР»РѕР¶РµРЅРёРµ Р·Р°РєСЂРѕРµС‚СЃСЏ
                .setPositiveButton(localResources.getString(R.string.yes), new DialogInterface.OnClickListener() {
                    public void onClick(DialogInterface dialog, int whichButton) {


                        //finish();
                    }
                })
                // РєРЅРѕРїРєР° "No", РїСЂРё РЅР°Р¶Р°С‚РёРё РЅР° РєРѕС‚РѕСЂСѓСЋ РЅРёС‡РµРіРѕ РЅРµ РїСЂРѕРёР·РѕР№РґРµС‚
                .setNegativeButton(localResources.getString(R.string.no), new DialogInterface.OnClickListener() {
                    public void onClick(DialogInterface dialog, int whichButton) {

                    }
                })
                .show();
    }
*/
    public void onBackPressed()
    {
        //super.onBackPressed();


    }

    private LocationListener locationListener = new LocationListener() {

        @Override
        public void onLocationChanged(Location location) {
            /*showLocation(location);*/
        }

        @Override
        public void onProviderDisabled(String provider) {
            //checkEnabled();
        }

        @Override
        public void onProviderEnabled(String provider) {
            //checkEnabled();
            /*
            if (ActivityCompat.checkSelfPermission(getContext(), Manifest.permission.ACCESS_FINE_LOCATION) != PackageManager.PERMISSION_GRANTED &&
                    ActivityCompat.checkSelfPermission(getContext(), Manifest.permission.ACCESS_COARSE_LOCATION) != PackageManager.PERMISSION_GRANTED)
            { }
            else
            {
                showLocation(locationManager.getLastKnownLocation(provider));
            }*/
        }

        @Override
        public void onStatusChanged(String provider, int status, Bundle extras) {
            /*if (provider.equals(LocationManager.GPS_PROVIDER))
            {
                tvStatusGPS.setText("Status: " + String.valueOf(status));
            }
            else if (provider.equals(LocationManager.NETWORK_PROVIDER))
            {
                tvStatusNet.setText("Status: " + String.valueOf(status));
            }*/
        }
    };

    /*
    private void showLocation(Location location) {
        if (location == null)
            return;
        if (location.getProvider().equals(LocationManager.GPS_PROVIDER)) {
            tvLocationGPS.setText(formatLocation(location));
        } else if (location.getProvider().equals(
                LocationManager.NETWORK_PROVIDER)) {
            tvLocationNet.setText(formatLocation(location));
        }
    }*/

        /*
    private String formatLocation(Location location) {
        if (location == null)
            return "";
        return String.format(
                "Coordinates: lat = %1$.4f, lon = %2$.4f, time = %3$tF %3$tT",
                location.getLatitude(), location.getLongitude(), new Date(
                        location.getTime()));
    }*/

    /*
    private void checkEnabled() {
        if (locationManager.isProviderEnabled(LocationManager.GPS_PROVIDER))
        {
            ibGPSHoS.setColorFilter(getResources().getColor(R.color.cGreen));
            ibGPSHoS.setImageResource(R.drawable.ic_gps_connected);
        }
        else
        {
            ibGPSHoS.setColorFilter(getResources().getColor(R.color.cRed));
            ibGPSHoS.setImageResource(R.drawable.ic_gps_disabled);
        }
    }*/

    public static interface ClickListener{
        public void onClick(View view, int position);
        public void onLongClick(View view, int position);
    }

    class RecyclerTouchListener implements RecyclerView.OnItemTouchListener{

        private HoSFragment.ClickListener clicklistener;
        private GestureDetector gestureDetector;

        public RecyclerTouchListener(Context context, final RecyclerView recycleView, final HoSFragment.ClickListener clicklistener){

            this.clicklistener=clicklistener;
            gestureDetector=new GestureDetector(context,new GestureDetector.SimpleOnGestureListener(){
                @Override
                public boolean onSingleTapUp(MotionEvent e) {
                    return true;
                }

                @Override
                public void onLongPress(MotionEvent e) {
                    View child=recycleView.findChildViewUnder(e.getX(),e.getY());
                    if(child!=null && clicklistener!=null){
                        clicklistener.onLongClick(child,recycleView.getChildAdapterPosition(child));
                    }
                }
            });
        }

        @Override
        public boolean onInterceptTouchEvent(RecyclerView rv, MotionEvent e) {
            View child=rv.findChildViewUnder(e.getX(),e.getY());
            if(child!=null && clicklistener!=null && gestureDetector.onTouchEvent(e)){
                clicklistener.onClick(child,rv.getChildAdapterPosition(child));
            }

            return false;
        }

        @Override
        public void onTouchEvent(RecyclerView rv, MotionEvent e) {

        }

        @Override
        public void onRequestDisallowInterceptTouchEvent(boolean disallowIntercept) {

        }
    }

}