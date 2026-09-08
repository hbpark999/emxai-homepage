from __future__ import annotations

import unittest

import numpy as np
import skrf as rf

from app.analysis import _mixed_mode_network, _fit_candidate, _select_fit, analyze, load_network


def make_series_inductor_touchstone() -> bytes:
    f = np.logspace(6, 9, 121)
    z0 = 50.0
    inductance = 22e-9
    z = 1j * 2 * np.pi * f * inductance
    den = 2 * z0 + z
    s11 = z / den
    s21 = 2 * z0 / den
    matrix = np.zeros((len(f), 2, 2), dtype=complex)
    matrix[:, 0, 0] = s11
    matrix[:, 1, 1] = s11
    matrix[:, 1, 0] = s21
    matrix[:, 0, 1] = s21
    lines = ["! Synthetic passive series inductor", "# HZ S RI R 50"]
    for frequency, values in zip(f, matrix):
        row = [frequency]
        # Touchstone 2-port order: S11, S21, S12, S22.
        for value in (values[0, 0], values[1, 0], values[0, 1], values[1, 1]):
            row.extend((value.real, value.imag))
        lines.append(" ".join(f"{value:.12e}" for value in row))
    return ("\n".join(lines) + "\n").encode("ascii")


class AnalysisTests(unittest.TestCase):
    def test_repeated_resonances_need_more_than_thirteen_poles(self):
        f = np.linspace(1e6, 4e9, 401)
        s = 2j * np.pi * f
        response = np.ones(len(f), dtype=complex) * 0.85
        for center in np.linspace(0.3e9, 3.6e9, 9):
            w = 2 * np.pi * center
            response *= (s*s + w*w) / (s*s + 0.035*w*s + w*w)
        matrix = np.zeros((len(f), 2, 2), dtype=complex)
        matrix[:, 0, 1] = matrix[:, 1, 0] = response
        network = rf.Network(f=f, s=matrix, z0=50)
        _, baseline = _fit_candidate(network, 3, 5)
        fitted, candidates, _ = _select_fit(network, 0.02)
        self.assertGreater(baseline.rms_error, 0.02)
        self.assertLess(fitted.get_rms_error(), 0.02)
        self.assertTrue(any(c.model_order > 13 for c in candidates))

    def test_load_and_fit_passive_two_port(self):
        data = make_series_inductor_touchstone()
        network = load_network(data, "series_l.s2p")
        self.assertEqual(network.nports, 2)
        result = analyze(data, "series_l.s2p", target_error=0.03)
        self.assertLess(result.vector_fit.get_rms_error(parameter_type="s"), 0.03)
        self.assertTrue(np.all(np.real(result.vector_fit.poles) < 0))
        self.assertIn(".SUBCKT EMXAI_SPARAM_MODEL", result.spice_text.upper())

    def test_split_pair_mixed_mode_conversion(self):
        f = np.logspace(6, 9, 31)
        phase = np.exp(-1j * 2 * np.pi * f * 120e-12)
        matrix = np.zeros((len(f), 4, 4), dtype=complex)
        matrix[:, 1, 0] = matrix[:, 0, 1] = 0.9 * phase
        matrix[:, 3, 2] = matrix[:, 2, 3] = 0.9 * phase
        network = rf.Network(f=f, s=matrix, z0=50, f_unit="hz")
        mixed = _mixed_mode_network(network, "split")
        self.assertTrue(np.allclose(np.abs(mixed.s[:, 1, 0]), 0.9, atol=1e-10))
        self.assertTrue(np.allclose(np.abs(mixed.s[:, 3, 2]), 0.9, atol=1e-10))
        self.assertTrue(np.allclose(mixed.s[:, 1, 2], 0.0, atol=1e-10))
        self.assertTrue(np.allclose(mixed.s[:, 3, 0], 0.0, atol=1e-10))


if __name__ == "__main__":
    unittest.main()

