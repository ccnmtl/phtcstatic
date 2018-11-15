---
title: "Activity"
module: "Building Logic Models"
type: "module-page"
menu:
  logicmodels:
    parent: "logicmodels"
    weight: 6
    identifier: "activity"
    pre: 3
depth: 3
next: "../further-reading/"
next_title: "Further Reading"
previous: "../introduction-to-activity/"
previous_title: "Introduction to Activity"
---
<div class="logicmodels">
<div class="pageblock logic-model-activity">
<h3>Build your own logic model</h3>

<div class="loading-overlay">Loading...</div>
<div class="logic-model-container">
<div id="phase_container">
<div class="phtc_print_logo print_only">
    {{< figure src="/img/logo-phtc2-horizontal.png" alt="" aria-hidden="true">}}
</div>
<h3 class="print_only">Building your own logic model</h3>
<div class="scenario-list-stage">
    <div class="logic-model-game-phase-name">
        Name of this phase of the game.
    </div>
    <div class="logic-model-game-phase-instructions">Instructions</div>
</div>

<div class="logic-model-initial-scenario_choice">
<div class="logic-model-initial-scenario-list"></div>
</div>

<div class="scenario-step-stage">
<div class="accordion" id="scenario-details">
<div class="accordion-group clearfix">
<div class="accordion-heading">
<a class="accordion-toggle arrow-open"
    id="scenarioHeaderTitle"
    data-toggle="collapse"
    data-parent="#scenario-details"
    href="#scenarioInstructions"> Scenario:
    <span class="scenario_title_2">
        Scenario title goes here
    </span>
</a>
</div>
<div id="scenarioInstructions" class="accordion-body collapse">
<div class="accordion-inner scenario_instructions mt-1">
    Scenario instructions go here
</div>
</div>
<button type="button" class="btn btn-sm btn-secondary change_scenario mt-1 float-right" data-toggle="modal" data-target="#changeScenario">
    Switch scenario
</button>
</div>
</div>

<hr />

<!-- Steps/Progress indicator -->
<div class="activity-progress clearfix" id="stepTag">
</div>

<div class="accordion" id="step-details">
<div class="accordion-group clearfix">
<div class="accordion-heading">
<a class="accordion-toggle arrow-open logic-model-game-phase-name switch-it2"
    id="stepHeaderTitle" data-toggle="collapse"
    data-parent="#step-details"
    href="#stepInstructions"> <span>Step
        of the game goes here.</span>
</a>
</div>
<div id="stepInstructions" class="accordion-body collapse">
<div class="accordion-inner logic-model-game-phase-instructions">
    Instructions
</div>
</div>
</div>
</div>
</div>
<!-- /.scenario-step-stage -->

<div class="table-toolbar">
<div class="previous_phase btn-logicmodel btn-info">
<i class="icon-arrow-left icon-white"></i> Back a step
</div>
<div class="wipe-table-button btn-logicmodel btn-info">
<i class="icon-trash icon-white"></i> Clear table
</div>

<div class="print_scenario btn-logicmodel btn-info">
<i class="icon-print icon-white"></i> Print scenario
</div>
<div class="show_expert_logic_model_link_div btn-logicmodel btn-info">
<i class="icon-file icon-white"></i>
<a target="_blank" href="" class="show_expert_logic_model_link">
    Show expert logic model
</a>
</div>
</div>

<div class="print-break clearfix"></div>

<!-- the whole table goes here: -->
<div class="logic-model-columns clearfix"></div>

</div>

<div class="modal help_box">this is just a placeholder.</div>

<div class="modal wipe-table-button-div" tabindex="-1" role="dialog">
    <div class="modal-dialog" role="document">
        <div class="modal-content">
            <div class="modal-header help-header">
                <h3>Are you sure you want to clear the table?</h3>
            </div>
            <div class="modal-body">
                <div>
                    This will permanently erase everything you
                    typed in the logic model table.
                </div>
            </div>
            <div class="modal-footer">
                <button class="wipe-table-confirm-button btn-logicmodel btn-danger">
                    Yes, I'm sure
                </button>
                <button class="wipe-table-cancel-button btn-logicmodel btn-success">
                    No
                </button>
            </div>
        </div>
    </div>
</div>
    <div id="changeScenario" class="modal" tabindex="-1" role="dialog">
    <div class="modal-dialog" role="document">
        <div class="modal-content">
            <div class="modal-header help-header">
                <h3 class="modal-title">Are you sure you want to switch scenario?</h3>
            </div>
            <div class="modal-body">
                <div>This will permanently erase everything you typed in the logic model table.</div>
            </div>
            <div class="modal-footer">
                <button type="button" class="change_scenario_confirm btn btn-danger" data-dismiss="modal">
                    Yes, I'm sure
                </button>
                <button type="button" class="btn btn-secondary" data-dismiss="modal">
                    No
                </button>
            </div>
        </div>
    </div>
</div>

</div>
</div>
</div>


