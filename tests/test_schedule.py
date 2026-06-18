from routers.sessions import generate_schedule, SECONDS_PER_MINUTE, PRESET, MEANINGFUL_FOCUS_CHUNK, LONG_BREAK
from schemas import SessionCreate
from hypothesis import given, settings
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
                       

@settings(max_examples=1000)
@given(
    planned=st.integers(min_value=600, max_value=36000),
    mode=st.sampled_from(["normal", "light", "intense"]),
)
def test_schedule_property_non_custom_mode(planned, mode):
    session = SessionCreate(
        session_planned_seconds=planned,
        mode=mode
    )
    result = generate_schedule(session)
    schedule = result["schedule"]
    total_time_assigned = 0
    long_break = PRESET.get(mode)[1]

    if LONG_BREAK.get(mode):
        long_break = LONG_BREAK.get(mode)[1]

    for i, cycle in enumerate(schedule):
        focus, break_time = cycle

        assert focus > 0
        assert focus <= (PRESET.get(mode)[0] + long_break + (MEANINGFUL_FOCUS_CHUNK - 1))
        
        if i < len(schedule) - 1:
            assert break_time > 0

        total_time_assigned += (focus + break_time)

    assert schedule[-1][1] == 0                
    assert total_time_assigned == planned       
    
@settings(max_examples=1000)
@given(
    planned=st.integers(min_value=600, max_value=36000),
    mode=st.sampled_from(["custom"]),
    focus_seconds=st.integers(min_value=600, max_value=10800),
    break_seconds=st.integers(min_value=60, max_value=3600)
)
def test_schedule_property_custom_mode(planned, mode, focus_seconds, break_seconds):
    session = SessionCreate(
        session_planned_seconds=planned,
        mode=mode,
        cycle_focus_seconds=focus_seconds,
        cycle_break_seconds=break_seconds
    )
    result = generate_schedule(session)
    schedule = result["schedule"]
    total_time_assigned = 0
    long_break = break_seconds

    if break_seconds < 30*SECONDS_PER_MINUTE:
        long_break = 30*SECONDS_PER_MINUTE

    for i, cycle in enumerate(schedule):
        focus, break_time = cycle

        assert focus > 0
        assert focus <= (focus_seconds + long_break + (MEANINGFUL_FOCUS_CHUNK - 1))
        
        if i < len(schedule) - 1:
            assert break_time > 0

        total_time_assigned += (focus + break_time)

    assert schedule[-1][1] == 0                
    assert total_time_assigned == planned 

@settings(max_examples=1000)
@given(
    planned=st.integers(min_value=600, max_value=36000),
    mode=st.sampled_from(["light", "intense"]),
)
def test_schedule_property_long_break_placement(planned, mode):
    session = SessionCreate(
        session_planned_seconds=planned,
        mode=mode
    )
    result = generate_schedule(session)
    schedule = result["schedule"]
    long_break = PRESET.get(mode)[1]

    if LONG_BREAK.get(mode):
        long_break = LONG_BREAK.get(mode)[1]

    for i, cycle in enumerate(schedule, start=1):
        focus, break_time = cycle

        if i < len(schedule):
            if i % LONG_BREAK.get(mode)[0] == 0:
                assert break_time == long_break
            elif i % LONG_BREAK.get(mode)[0] != 0:
                assert break_time == PRESET.get(mode)[1]

@settings(max_examples=1000)
@given(
    planned=st.integers(min_value=600, max_value=36000),
    mode=st.sampled_from(["custom"]),
    focus_seconds=st.integers(min_value=600, max_value=10800),
    break_seconds=st.integers(min_value=60, max_value=3600)
)
def test_schedule_property_custom_mode_long_break_placement(planned, mode, focus_seconds, break_seconds):
    session = SessionCreate(
        session_planned_seconds=planned,
        mode=mode,
        cycle_focus_seconds=focus_seconds,
        cycle_break_seconds=break_seconds
    )
    result = generate_schedule(session)
    schedule = result["schedule"]
    total_focus = 0
    long_break = break_seconds

    if break_seconds < 30*SECONDS_PER_MINUTE:
        long_break = 30*SECONDS_PER_MINUTE

    for i, cycle in enumerate(schedule, start=1):
        focus, break_time = cycle
        total_focus += focus

        if i < len(schedule):
            if total_focus >= (180*SECONDS_PER_MINUTE) and long_break != break_seconds:
                assert break_time == long_break
                total_focus = 0
            else: 
                assert break_time == break_seconds
    



    