CREATE TABLE IF NOT EXISTS attendance_event_logs (
    id BIGSERIAL PRIMARY KEY,
    employee_id BIGINT NOT NULL REFERENCES employees(id) ON DELETE CASCADE,
    log_timestamp TIMESTAMP NOT NULL,
    source VARCHAR(20) NOT NULL CHECK (source IN ('camera', 'mobile', 'device')),
    camera_name VARCHAR(255),
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_attendance_event_logs_employee_timestamp
    ON attendance_event_logs (employee_id, log_timestamp);

CREATE INDEX IF NOT EXISTS idx_attendance_event_logs_timestamp
    ON attendance_event_logs (log_timestamp);

CREATE INDEX IF NOT EXISTS idx_attendance_event_logs_source_timestamp
    ON attendance_event_logs (source, log_timestamp);


CREATE TABLE IF NOT EXISTS attendance_daily_records (
    id BIGSERIAL PRIMARY KEY,
    employee_id BIGINT NOT NULL REFERENCES employees(id) ON DELETE CASCADE,
    attendance_date DATE NOT NULL,
    status VARCHAR(20) NOT NULL CHECK (status IN ('present', 'absent')),
    in_time TIMESTAMP NULL,
    out_time TIMESTAMP NULL,
    in_source VARCHAR(20) NULL,
    out_source VARCHAR(20) NULL,
    in_camera_name VARCHAR(255) NULL,
    out_camera_name VARCHAR(255) NULL,
    sources TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[],
    camera_names TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[],
    shift_start TIME NULL,
    shift_window_start TIMESTAMP NULL,
    shift_window_end TIMESTAMP NULL,
    total_logs INTEGER NOT NULL DEFAULT 0,
    deduplicated_logs INTEGER NOT NULL DEFAULT 0,
    single_log BOOLEAN NOT NULL DEFAULT FALSE,
    in_window_matched BOOLEAN NOT NULL DEFAULT FALSE,
    remark TEXT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
    CONSTRAINT uq_attendance_daily_records_employee_date UNIQUE (employee_id, attendance_date),
    CONSTRAINT chk_attendance_daily_records_sources
        CHECK (
            in_source IS NULL OR in_source IN ('camera', 'mobile', 'device')
        ),
    CONSTRAINT chk_attendance_daily_records_out_sources
        CHECK (
            out_source IS NULL OR out_source IN ('camera', 'mobile', 'device')
        )
);

CREATE INDEX IF NOT EXISTS idx_attendance_daily_records_date
    ON attendance_daily_records (attendance_date);

CREATE INDEX IF NOT EXISTS idx_attendance_daily_records_employee_date
    ON attendance_daily_records (employee_id, attendance_date);

/*
Raw log lookup for a single employee and day:

SELECT id, employee_id, log_timestamp, source, camera_name
FROM attendance_event_logs
WHERE employee_id = $1
  AND log_timestamp >= $2
  AND log_timestamp < $3
ORDER BY log_timestamp ASC, id ASC;


Active shift lookup for a given employee and date:

SELECT active_shift.shift_start
FROM employees e
LEFT JOIN LATERAL (
    SELECT s.on_duty_time::text AS shift_start
    FROM schedule_employees se
    JOIN shifts s ON s.id = se.shift_id
    WHERE se.employee_id = e.system_user_id
      AND (se.from_date IS NULL OR se.from_date <= $1)
      AND (se.to_date IS NULL OR se.to_date >= $1)
      AND (s.from_date IS NULL OR s.from_date <= $1)
      AND (s.to_date IS NULL OR s.to_date >= $1)
    ORDER BY
        COALESCE(se.updated_at, se.created_at) DESC NULLS LAST,
        COALESCE(se.from_date, s.from_date) DESC NULLS LAST,
        se.id DESC
    LIMIT 1
) active_shift ON TRUE
WHERE e.id = $2;
*/
