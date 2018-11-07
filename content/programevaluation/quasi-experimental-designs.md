---
title: "Quasi-Experimental Designs"
module: "Advanced Program Evaluation"
type: "module-page"
menu:
  programevaluation:
    parent: "programevaluation"
    weight: 16
    identifier: "quasi-experimental-designs"
    pre: 4
depth: 4
next: "../practice-design-notation/"
next_title: "Practice Design Notation"
previous: "../randomized-controlled-trials/"
previous_title: "Randomized Controlled Trials"
---

Randomized designs are not possible in most evaluations. As an alternative, there are many different kinds of quasi-experimental designs that vary in terms of rigor. Here are some examples:

<div class="d-flex justify-content-center randomized-notation">
    <div class="cell">
        NR
    </div>
    <div class="cell">
        O
    </div>
    <div class="cell">
        X
    </div>
    <div class="cell">
        O
    </div>
</div>
<div class="d-flex justify-content-center randomized-notation mb-3">
    <div class="cell">
        NR
    </div>
    <div class="cell">
        O
    </div>
    <div class="cell">
        &nbsp;
    </div>
    <div class="cell">
        O
    </div>
</div>

The two groups are not randomly assigned, as indicated by the NR (Not Random). The second group is a comparison group. For example, we might be able to use half of the county, or a neighboring county, as a comparison group for our evaluation. Or maybe we give access to ShapeTracker to a group of Middleton county residents and then find a comparison group of other Middleton county residents with comparable demographic characteristics.
We can also add more outcome observation points to enhance the design.

<div class="d-flex justify-content-center randomized-notation">
    <div class="cell">
        NR
    </div>
    <div class="cell">
        O
    </div>
    <div class="cell">
        X
    </div>
    <div class="cell">
        O
    </div>
    <div class="cell">
        O
    </div>
    <div class="cell">
        O
    </div>
</div>
<div class="d-flex justify-content-center randomized-notation mb-3">
    <div class="cell">
        NR
    </div>
    <div class="cell">
        O
    </div>
    <div class="cell">
        &nbsp;
    </div>
    <div class="cell">
        O
    </div>
    <div class="cell">
        O
    </div>
    <div class="cell">
        O
    </div>
</div>

For example, the first post-test could be after 3 months of using ShapeTracker, and then we could survey the users again at 6 months and 12 months, as indicated by the additional Os in the diagram. The comparison group has the same schedule of outcome measures but no intervention.

If it is too late, or otherwise impossible, to get a baseline measure of the outcome, the design would look like this:

<div class="d-flex justify-content-center randomized-notation">
    <div class="cell">
        NR
    </div>
    <div class="cell">
        X
    </div>
    <div class="cell">
        O
    </div>
    <div class="cell">
        O
    </div>
    <div class="cell">
        O
    </div>
</div>
<div class="d-flex justify-content-center randomized-notation mb-3">
    <div class="cell">
        NR
    </div>
    <div class="cell">
        &nbsp;
    </div>
    <div class="cell">
        O
    </div>
    <div class="cell">
        O
    </div>
    <div class="cell">
        O
    </div>
</div>

Or, if a comparison group cannot be identified, the design would look like this:

<div class="d-flex justify-content-center randomized-notation mb-3">
    <div class="cell">
        O
    </div>
    <div class="cell">
        X
    </div>
    <div class="cell">
        O
    </div>
    <div class="cell">
        O
    </div>
    <div class="cell">
        O
    </div>
</div>

This is a one-group pre-post design, with two additional follow-up measures of the outcome. Here we would be only assessing ShapeTraker users and whether their outcomes change over time. This type of design has limited validity because improvement over time can be due to factors other than the intervention.
If you cannot have a comparison group or a baseline, you are left with a very weak design of one-group, post-test only:

<div class="d-flex justify-content-center randomized-notation mb-3">
    <div class="cell">
        X
    </div>
    <div class="cell">
        O
    </div>
</div>
