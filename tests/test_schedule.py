from routers.sessions import generate_schedule, SECONDS_PER_MINUTE
from schemas import SessionCreate

def test_light_mode_basic():
    session = SessionCreate(
        session_planned_seconds=120*SECONDS_PER_MINUTE,
        mode="light"
    )
    result = generate_schedule(session)
    schedule = result["schedule"]
    assert schedule ==[(120*SECONDS_PER_MINUTE, 0)]

def test_light_mode_basic_2():
    session = SessionCreate(
        session_planned_seconds=480*SECONDS_PER_MINUTE,
        mode="light"
    )
    result = generate_schedule(session)
    schedule = result["schedule"]
    assert schedule ==[(90*SECONDS_PER_MINUTE, 20*SECONDS_PER_MINUTE),
                       (90*SECONDS_PER_MINUTE, 30*SECONDS_PER_MINUTE),
                       (90*SECONDS_PER_MINUTE, 20*SECONDS_PER_MINUTE),
                       (140*SECONDS_PER_MINUTE, 0)]
                       
def test_light_mode_exact_one_cycle_time():
    session = SessionCreate(
        session_planned_seconds=110*SECONDS_PER_MINUTE,
        mode="light"
    )
    result = generate_schedule(session)
    schedule = result["schedule"]
    assert schedule ==[(110*SECONDS_PER_MINUTE, 0)]

def test_light_mode_exact_two_cycles_time():
    session = SessionCreate(
        session_planned_seconds=220*SECONDS_PER_MINUTE,
        mode="light"
    )
    result = generate_schedule(session)
    schedule = result["schedule"]
    assert schedule ==[(90*SECONDS_PER_MINUTE, 20*SECONDS_PER_MINUTE), (110*SECONDS_PER_MINUTE, 0)]

def test_light_mode_bumped_break_causes_extra_total_time():
    session = SessionCreate(
        session_planned_seconds=225*SECONDS_PER_MINUTE,
        mode="light"
    )
    result = generate_schedule(session)
    schedule = result["schedule"]
    assert schedule == [(90*SECONDS_PER_MINUTE, 20*SECONDS_PER_MINUTE),(115*SECONDS_PER_MINUTE, 0)]

def test_light_mode_absorb_less_than_meaningful_chunk():
    session = SessionCreate(
        session_planned_seconds=126*SECONDS_PER_MINUTE,
        mode="light"
    )
    result = generate_schedule(session)
    schedule = result["schedule"]
    assert schedule ==[(126*SECONDS_PER_MINUTE, 0)]

