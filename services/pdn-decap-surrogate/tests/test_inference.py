import unittest

from fastapi.testclient import TestClient

from main import app


class InferenceTests(unittest.TestCase):
    def setUp(self):
        self.client = TestClient(app)

    def test_default_prediction_has_distinct_definitions(self):
        response = self.client.post("/v1/predict", json={"include_curve": False})
        self.assertEqual(response.status_code, 200)
        body = response.json()
        self.assertIn("series C + ESR + ESL + Lpath", body["educational_decap"]["definition"])
        self.assertIn("complex two-port", body["ic_pin_impedance"]["definition"])
        self.assertGreater(body["lpath_nh"], 0)

    def test_distance_changes_lpath(self):
        response = self.client.post(
            "/v1/compare-distance",
            json={"d_a_mm": 2, "d_b_mm": 10, "include_curve": False},
        )
        self.assertEqual(response.status_code, 200)
        body = response.json()
        self.assertGreater(body["case_b"]["lpath_nh"], body["case_a"]["lpath_nh"])
        self.assertAlmostEqual(body["case_a"]["lpath_nh"], 1.392163707, places=6)
        self.assertAlmostEqual(body["case_b"]["lpath_nh"], 3.719752439, places=6)

    def test_stackup_constraint(self):
        response = self.client.post(
            "/v1/predict",
            json={"geometry": {"h_top_mm": 1.0, "h_pg_mm": 0.8}},
        )
        self.assertEqual(response.status_code, 422)


if __name__ == "__main__":
    unittest.main()
