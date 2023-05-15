from ..featurizers import FeaturizerIdentity, featurizer_map


def test_featurizer_map_has_expected_structure():
    fm = featurizer_map()
    assert type(fm) == dict
    assert len(fm) > 0

    for (k, v) in fm.items():
        assert type(k) == str
        assert type(v) == FeaturizerIdentity
        assert k == v.identifier()


def test_featurizer_ui_properties():
    for f in featurizer_map().values():
        ui = f.ui_repr()
        assert set(ui.keys()) == {"path", "name"}
        assert ui["path"] == f.path
        assert ui["name"] == f.name
        assert f.identifier() == ".".join(f.path + [f.name])
        assert f.identifier() == ".".join(ui["path"] + [ui["name"]])


def test_featurizer_help_text():
    class DummyHelpTextClass:
        """This class has some dummy help text!"""

        def method(self):
            """It also has a method, but we should exclude method docs from help
            text."""

        def static_method(self):
            """The same is true for static methods"""

    fi = FeaturizerIdentity(path="", name="", klass=DummyHelpTextClass)
    assert (
        fi.help_html()
        == "This&nbsp;class&nbsp;has&nbsp;some&nbsp;dummy&nbsp;help&nbsp;text!"
    )
