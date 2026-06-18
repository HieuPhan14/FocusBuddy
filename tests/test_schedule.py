from routers.sessions import generate_schedule, SECONDS_PER_MINUTE
from schemas import SessionCreate
from hypothesis import given
import hypothesis.strategies as st

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
                       (90*SECONDS_PER_MINUTE, 30*SECONDS_PER_MINUTE),
                       (20*SECONDS_PER_MINUTE, 0)]
                       
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
    assert schedule ==[(90*SECONDS_PER_MINUTE, 20*SECONDS_PER_MINUTE), (16*SECONDS_PER_MINUTE, 0)]

def test_normal_mode_basic():
    session = SessionCreate(
        session_planned_seconds=480*SECONDS_PER_MINUTE,
        mode="normal"
    )
    result = generate_schedule(session)
    schedule = result["schedule"]
    assert schedule ==[(52*SECONDS_PER_MINUTE, 17*SECONDS_PER_MINUTE),
                       (52*SECONDS_PER_MINUTE, 17*SECONDS_PER_MINUTE),
                       (52*SECONDS_PER_MINUTE, 17*SECONDS_PER_MINUTE),
                       (52*SECONDS_PER_MINUTE, 17*SECONDS_PER_MINUTE),
                       (52*SECONDS_PER_MINUTE, 17*SECONDS_PER_MINUTE),
                       (52*SECONDS_PER_MINUTE, 17*SECONDS_PER_MINUTE),
                       (66*SECONDS_PER_MINUTE, 0)]
                       
def test_custom_mode_basic():
    session = SessionCreate(
        session_planned_seconds=300*SECONDS_PER_MINUTE,
        mode="custom",
        cycle_focus_seconds=60*SECONDS_PER_MINUTE,
        cycle_break_seconds=10*SECONDS_PER_MINUTE
    )
    result = generate_schedule(session)
    schedule = result["schedule"]
    assert schedule ==[(60*SECONDS_PER_MINUTE, 10*SECONDS_PER_MINUTE),
                       (60*SECONDS_PER_MINUTE, 10*SECONDS_PER_MINUTE),
                       (60*SECONDS_PER_MINUTE, 30*SECONDS_PER_MINUTE),
                       (70*SECONDS_PER_MINUTE, 0)]
    
def test_intense_mode_intense():
    session = SessionCreate(
        session_planned_seconds=480*SECONDS_PER_MINUTE,
        mode="intense",
    )
    result = generate_schedule(session)
    schedule = result["schedule"]
    assert schedule ==[(25*SECONDS_PER_MINUTE, 5*SECONDS_PER_MINUTE),
                       (25*SECONDS_PER_MINUTE, 5*SECONDS_PER_MINUTE),
                       (25*SECONDS_PER_MINUTE, 5*SECONDS_PER_MINUTE),
                       (25*SECONDS_PER_MINUTE, 15*SECONDS_PER_MINUTE),
                       (25*SECONDS_PER_MINUTE, 5*SECONDS_PER_MINUTE),
                       (25*SECONDS_PER_MINUTE, 5*SECONDS_PER_MINUTE),
                       (25*SECONDS_PER_MINUTE, 5*SECONDS_PER_MINUTE),
                       (25*SECONDS_PER_MINUTE, 15*SECONDS_PER_MINUTE),
                       (25*SECONDS_PER_MINUTE, 5*SECONDS_PER_MINUTE),
                       (25*SECONDS_PER_MINUTE, 5*SECONDS_PER_MINUTE),
                       (25*SECONDS_PER_MINUTE, 5*SECONDS_PER_MINUTE),
                       (25*SECONDS_PER_MINUTE, 15*SECONDS_PER_MINUTE),
                       (25*SECONDS_PER_MINUTE, 5*SECONDS_PER_MINUTE),
                       (25*SECONDS_PER_MINUTE, 5*SECONDS_PER_MINUTE),
                       (30*SECONDS_PER_MINUTE, 0)]
    
def test_light_mode_less_than_a_cycle_greater_than_meaningful_chunk():
    session = SessionCreate(
        session_planned_seconds=50*SECONDS_PER_MINUTE,
        mode="light"
    )
    result = generate_schedule(session)
    schedule = result["schedule"]
    assert schedule ==[(50*SECONDS_PER_MINUTE, 0)]

def test_normal_mode_less_than_a_cycle_greater_than_meaningful_chunk():
    session = SessionCreate(
        session_planned_seconds=50*SECONDS_PER_MINUTE,
        mode="normal"
    )
    result = generate_schedule(session)
    schedule = result["schedule"]
    assert schedule ==[(50*SECONDS_PER_MINUTE, 0)]

def test_light_intense_less_than_a_cycle_greater_than_meaningful_chunk():
    session = SessionCreate(
        session_planned_seconds=29*SECONDS_PER_MINUTE,
        mode="intense"
    )
    result = generate_schedule(session)
    schedule = result["schedule"]
    assert schedule ==[(29*SECONDS_PER_MINUTE, 0)]

def test_custom_with_break_greater_than_30_minutes():
    session = SessionCreate(
        session_planned_seconds=300*SECONDS_PER_MINUTE,
        mode="custom",
        cycle_focus_seconds=60*SECONDS_PER_MINUTE,
        cycle_break_seconds=35*SECONDS_PER_MINUTE
    )
    result = generate_schedule(session)
    schedule = result["schedule"]
    assert schedule ==[(60*SECONDS_PER_MINUTE, 35*SECONDS_PER_MINUTE),
                       (60*SECONDS_PER_MINUTE, 35*SECONDS_PER_MINUTE),
                       (60*SECONDS_PER_MINUTE, 35*SECONDS_PER_MINUTE),
                       (15*SECONDS_PER_MINUTE, 0)]
                       

