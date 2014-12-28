/*
 * jQuery Mobile Framework : plugin to provide a date and time picker.
 * Copyright (c) JTSage
 * CC 3.0 Attribution.  May be relicensed without permission/notification.
 * https://github.com/jtsage/jquery-mobile-datebox
 */
(function (a) {
    a.extend(a.mobile.datebox.prototype.options, {
        themeButton: "a",
        themeInput: "a",
        useSetButton: true,
        validHours: false,
        repButton: true
    });
    a.extend(a.mobile.datebox.prototype, {
        _dbox_run: function () {
            var b = this;
            b.drag.didRun = true;
            b._offset(b.drag.target[0], b.drag.target[1], false);
            b._dbox_run_update();
            b.runButton = setTimeout(function () {
                b._dbox_run()
            }, 150)
        }, _dbox_run_update: function () {
            var b = this, c = this.options;
            if (c.mode === "datebox") {
                b.d.intHTML.find(".ui-datebox-header").find("h4").text(b._formatter(b.__("headerFormat"), b.theDate))
            }
            b.d.divIn.find("input").each(function () {
                switch (a(this).jqmData("field")) {
                    case"y":
                        a(this).val(b.theDate.getFullYear());
                        break;
                    case"m":
                        a(this).val(b.theDate.getMonth() + 1);
                        break;
                    case"d":
                        a(this).val(b.theDate.getDate());
                        break;
                    case"h":
                        if (b.__("timeFormat") === 12) {
                            if (b.theDate.getHours() > 12) {
                                a(this).val(b.theDate.getHours() - 12);
                                break
                            } else {
                                if (b.theDate.getHours() === 0) {
                                    a(this).val(12);
                                    break
                                }
                            }
                        }
                        a(this).val(b.theDate.getHours());
                        break;
                    case"i":
                        a(this).val(b._zPad(b.theDate.getMinutes()));
                        break;
                    case"M":
                        a(this).val(b.__("monthsOfYearShort")[b.theDate.getMonth()]);
                        break;
                    case"a":
                        a(this).val((b.theDate.getHours() > 11) ? b.__("meridiem")[1] : b.__("meridiem")[0]);
                        break
                }
            })
        }, _dbox_vhour: function (g) {
            var b = this, f = this.options, e, d = [25, 0], c = [25, 0];
            if (f.validHours === false) {
                return true
            }
            if (a.inArray(b.theDate.getHours(), f.validHours) > -1) {
                return true
            }
            e = b.theDate.getHours();
            a.each(f.validHours, function () {
                if (((e < this) ? 1 : -1) === g) {
                    if (d[0] > Math.abs(this - e)) {
                        d = [Math.abs(this - e), parseInt(this, 10)]
                    }
                } else {
                    if (c[0] > Math.abs(this - e)) {
                        c = [Math.abs(this - e), parseInt(this, 10)]
                    }
                }
            });
            if (d[1] !== 0) {
                b.theDate.setHours(d[1])
            } else {
                b.theDate.setHours(c[1])
            }
        }, _dbox_enter: function (c) {
            var b = this;
            if (c.jqmData("field") === "M" && a.inArray(c.val(), b.__("monthsOfYearShort")) > -1) {
                b.theDate.setMonth(a.inArray(c.val(), b.__("monthsOfYearShort")))
            }
            if (c.val() !== "" && c.val().toString().search(/^[0-9]+$/) === 0) {
                switch (c.jqmData("field")) {
                    case"y":
                        b.theDate.setFullYear(parseInt(c.val(), 10));
                        break;
                    case"m":
                        b.theDate.setMonth(parseInt(c.val(), 10) - 1);
                        break;
                    case"d":
                        b.theDate.setDate(parseInt(c.val(), 10));
                        break;
                    case"h":
                        b.theDate.setHours(parseInt(c.val(), 10));
                        break;
                    case"i":
                        b.theDate.setMinutes(parseInt(c.val(), 10));
                        break
                }
            }
            b.refresh()
        }
    });
    a.extend(a.mobile.datebox.prototype._build, {
        timebox: function () {
            this._build.datebox.apply(this, [])
        }, datebox: function () {
            var u = this, n = this.drag, f = this.options, l, s, m, h = -2, q = "ui-datebox-", r = a("<div>"), c = a("<fieldset>"), j = r.clone(), k = c.clone(), e = a("<input type='" + u.inputType + "' />").addClass("ui-input-text ui-corner-all ui-mini ui-shadow-inset ui-body-" + f.themeInput), t = a("<input type='text' />").addClass("ui-input-text ui-mini ui-corner-all ui-shadow-inset ui-body-" + f.themeInput), p = a("<div></div>"), b = {
                theme: f.themeButton,
                icon: "plus",
                iconpos: "bottom",
                corners: true,
                shadow: true,
                inline: true
            }, d = a.extend({}, b, {icon: "minus", iconpos: "top"});
            if (typeof u.d.intHTML !== "boolean") {
                u.d.intHTML.empty().remove()
            }
            u.d.headerText = ((u._grabLabel() !== false) ? u._grabLabel() : ((f.mode === "datebox") ? u.__("titleDateDialogLabel") : u.__("titleTimeDialogLabel")));
            u.d.intHTML = a("<span>");
            if (u.inputType !== "number") {
                e.attr("pattern", "[0-9]*")
            }
            u.fldOrder = ((f.mode === "datebox") ? u.__("dateFieldOrder") : u.__("timeFieldOrder"));
            u._check();
            u._minStepFix();
            u._dbox_vhour(typeof u._dbox_delta !== "undefined" ? u._dbox_delta : 1);
            if (f.mode === "datebox") {
                a('<div class="' + q + 'header"><h4>' + u._formatter(u.__("headerFormat"), u.theDate) + "</h4></div>").appendTo(u.d.intHTML)
            }
            for (l = 0; l <= u.fldOrder.length; l++) {
                m = ["a", "b", "c", "d", "e", "f"][l];
                switch (u.fldOrder[l]) {
                    case"y":
                    case"m":
                    case"d":
                    case"h":
                        a("<div>").append(u._makeEl(e, {
                            attr: {
                                field: u.fldOrder[l],
                                amount: 1
                            }
                        })).addClass("ui-mini ui-block-" + m).appendTo(j);
                        u._makeEl(p, {
                            attr: {
                                field: u.fldOrder[l],
                                amount: 1
                            }
                        }).addClass("ui-mini ui-block-" + m).buttonMarkup(b).appendTo(c);
                        u._makeEl(p, {
                            attr: {
                                field: u.fldOrder[l],
                                amount: 1
                            }
                        }).addClass("ui-mini ui-block-" + m).buttonMarkup(d).appendTo(k);
                        h++;
                        break;
                    case"a":
                        if (u.__("timeFormat") === 12) {
                            a("<div>").append(u._makeEl(t, {
                                attr: {
                                    field: u.fldOrder[l],
                                    amount: 1
                                }
                            })).addClass("ui-mini ui-block-" + m).appendTo(j);
                            u._makeEl(p, {
                                attr: {
                                    field: u.fldOrder[l],
                                    amount: 1
                                }
                            }).addClass("ui-mini ui-block-" + m).buttonMarkup(b).appendTo(c);
                            u._makeEl(p, {
                                attr: {
                                    field: u.fldOrder[l],
                                    amount: 1
                                }
                            }).addClass("ui-mini ui-block-" + m).buttonMarkup(d).appendTo(k);
                            h++
                        }
                        break;
                    case"M":
                        a("<div>").append(u._makeEl(t, {
                            attr: {
                                field: u.fldOrder[l],
                                amount: 1
                            }
                        })).addClass("ui-mini ui-block-" + m).appendTo(j);
                        u._makeEl(p, {
                            attr: {
                                field: u.fldOrder[l],
                                amount: 1
                            }
                        }).addClass("ui-mini ui-block-" + m).buttonMarkup(b).appendTo(c);
                        u._makeEl(p, {
                            attr: {
                                field: u.fldOrder[l],
                                amount: 1
                            }
                        }).addClass("ui-mini ui-block-" + m).buttonMarkup(d).appendTo(k);
                        h++;
                        break;
                    case"i":
                        a("<div>").append(u._makeEl(e, {
                            attr: {
                                field: u.fldOrder[l],
                                amount: f.minuteStep
                            }
                        })).addClass("ui-mini ui-block-" + m).appendTo(j);
                        u._makeEl(p, {
                            attr: {
                                field: u.fldOrder[l],
                                amount: f.minuteStep
                            }
                        }).addClass("ui-block-" + m).buttonMarkup(b).appendTo(c);
                        u._makeEl(p, {
                            attr: {
                                field: u.fldOrder[l],
                                amount: f.minuteStep
                            }
                        }).addClass("ui-block-" + m).buttonMarkup(d).appendTo(k);
                        h++;
                        break
                }
            }
            c.addClass("ui-grid-" + ["a", "b", "c", "d", "e"][h]).appendTo(u.d.intHTML);
            j.addClass("ui-datebox-dboxin").addClass("ui-grid-" + ["a", "b", "c", "d", "e"][h]).appendTo(u.d.intHTML);
            k.addClass("ui-grid-" + ["a", "b", "c", "d", "e"][h]).appendTo(u.d.intHTML);
            if (f.mobVer >= 140) {
                k.find("div").css({"min-height": "2.3em"});
                c.find("div").css({"min-height": "2.3em"})
            }
            j.find("input").each(function () {
                switch (a(this).jqmData("field")) {
                    case"y":
                        a(this).val(u.theDate.getFullYear());
                        break;
                    case"m":
                        a(this).val(u.theDate.getMonth() + 1);
                        break;
                    case"d":
                        a(this).val(u.theDate.getDate());
                        break;
                    case"h":
                        if (u.__("timeFormat") === 12) {
                            if (u.theDate.getHours() > 12) {
                                a(this).val(u.theDate.getHours() - 12);
                                break
                            } else {
                                if (u.theDate.getHours() === 0) {
                                    a(this).val(12);
                                    break
                                }
                            }
                        }
                        a(this).val(u.theDate.getHours());
                        break;
                    case"i":
                        a(this).val(u._zPad(u.theDate.getMinutes()));
                        break;
                    case"M":
                        a(this).val(u.__("monthsOfYearShort")[u.theDate.getMonth()]);
                        break;
                    case"a":
                        a(this).val((u.theDate.getHours() > 11) ? u.__("meridiem")[1] : u.__("meridiem")[0]);
                        break
                }
            });
            u.d.divIn = j;
            if (u.dateOK !== true) {
                j.find("input").addClass(q + "griddate-disable")
            } else {
                j.find("." + q + "griddate-disable").removeClass(q + "griddate-disable")
            }
            if (f.useSetButton || f.useClearButton) {
                s = a("<div>", {"class": q + "controls"});
                if (f.useSetButton) {
                    a('<a href="#">' + ((f.mode === "datebox") ? u.__("setDateButtonLabel") : u.__("setTimeButtonLabel")) + "</a>").appendTo(s).buttonMarkup({
                        theme: f.theme,
                        icon: "check",
                        iconpos: "left",
                        corners: true,
                        shadow: true
                    }).on(f.clickEventAlt, function (g) {
                        g.preventDefault();
                        if (u.dateOK === true) {
                            u.d.input.trigger("datebox", {
                                method: "set",
                                value: u._formatter(u.__fmt(), u.theDate),
                                date: u.theDate
                            });
                            u.d.input.trigger("datebox", {method: "close"})
                        }
                    })
                }
                if (f.useClearButton) {
                    a('<a href="#">' + u.__("clearButton") + "</a>").appendTo(s).buttonMarkup({
                        theme: f.theme,
                        icon: "delete",
                        iconpos: "left",
                        corners: true,
                        shadow: true
                    }).on(f.clickEventAlt, function (g) {
                        g.preventDefault();
                        u.d.input.val("");
                        u.d.input.trigger("datebox", {method: "clear"});
                        u.d.input.trigger("datebox", {method: "close"})
                    })
                }
                if (f.useCollapsedBut) {
                    s.addClass("ui-datebox-collapse")
                }
                s.appendTo(u.d.intHTML)
            }
            if (f.repButton === false) {
                c.on(f.clickEvent, "div", function (g) {
                    g.preventDefault();
                    u._dbox_delta = 1;
                    u._offset(a(this).jqmData("field"), a(this).jqmData("amount"))
                });
                k.on(f.clickEvent, "div", function (g) {
                    g.preventDefault();
                    u._dbox_delta = -1;
                    u._offset(a(this).jqmData("field"), a(this).jqmData("amount") * -1)
                })
            }
            j.on("change", "input", function () {
                u._dbox_enter(a(this))
            });
            if (u.wheelExists) {
                j.on("mousewheel", "input", function (g, i) {
                    g.preventDefault();
                    u._dbox_delta = i < 0 ? -1 : 1;
                    u._offset(a(this).jqmData("field"), ((i < 0) ? -1 : 1) * a(this).jqmData("amount"))
                })
            }
            if (f.repButton === true) {
                c.on(u.drag.eStart, "div", function (g) {
                    m = [a(this).jqmData("field"), a(this).jqmData("amount")];
                    u.drag.move = true;
                    u._dbox_delta = 1;
                    u._offset(m[0], m[1], false);
                    u._dbox_run_update();
                    if (!u.runButton) {
                        u.drag.target = m;
                        u.runButton = setTimeout(function () {
                            u._dbox_run()
                        }, 500)
                    }
                });
                k.on(u.drag.eStart, "div", function (g) {
                    m = [a(this).jqmData("field"), a(this).jqmData("amount") * -1];
                    u.drag.move = true;
                    u._dbox_delta = -1;
                    u._offset(m[0], m[1], false);
                    u._dbox_run_update();
                    if (!u.runButton) {
                        u.drag.target = m;
                        u.runButton = setTimeout(function () {
                            u._dbox_run()
                        }, 500)
                    }
                });
                c.on(n.eEndA, function (g) {
                    if (n.move) {
                        g.preventDefault();
                        clearTimeout(u.runButton);
                        u.runButton = false;
                        n.move = false
                    }
                });
                k.on(n.eEndA, function (g) {
                    if (n.move) {
                        g.preventDefault();
                        clearTimeout(u.runButton);
                        u.runButton = false;
                        n.move = false
                    }
                })
            }
        }
    })
})(jQuery);