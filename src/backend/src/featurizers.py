from dataclasses import dataclass
from functools import lru_cache
from typing import List

import matminer
import matminer.featurizers
import matminer.featurizers.bandstructure
import matminer.featurizers.base
import matminer.featurizers.composition.alloy
import matminer.featurizers.composition.composite
import matminer.featurizers.composition.element
import matminer.featurizers.composition.ion
import matminer.featurizers.composition.orbital
import matminer.featurizers.composition.packing
import matminer.featurizers.composition.thermo
import matminer.featurizers.conversions
import matminer.featurizers.dos
import matminer.featurizers.function
import matminer.featurizers.site.bonding
import matminer.featurizers.site.chemical
import matminer.featurizers.site.external
import matminer.featurizers.site.fingerprint
import matminer.featurizers.site.misc
import matminer.featurizers.site.rdf
import matminer.featurizers.structure
import matminer.featurizers.structure.bonding
import matminer.featurizers.structure.composite
import matminer.featurizers.structure.matrix
import matminer.featurizers.structure.misc
import matminer.featurizers.structure.order
import matminer.featurizers.structure.rdf
import matminer.featurizers.structure.sites


@dataclass
class FeaturizerIdentity:
    """A class used to provide information to the UI about available featurizers.

    Goals:

    - Stable identifiers: Because each featurizer is a Python class, we need to
        be careful about how we let the UI specify which featurizer is used.
        For example, if we let the UI provide a path
        (e.g. `matminer.featurizers.bandstructure.BranchPointEnergy`),
        a malicious user would be able to pass any function name of their
        choice, creating a code injection vulnerability.
        Additionally the identifier may be stored (in a cookie, local storage,
        or a database), so using python's `id` function isn't sufficient here
        because the id is only stable over the lifetime of the object.
        For this reason, this class implements __hash__, and the hash should
        be used to identify which featurizer has been selected.
    - Human-readable. The path and name attributes should be human-readable; machine-readable information can be gathered from the `klass` attribute.

    Attributes:
        path: A list of human-readable strings identifying the collection that a featurizer belongs to. For example, this could be `['Band Structure', 'Branch Point Energy']`.
        name: A human-readable name for the featurizer.
        klass: A class object that can be used to instantiate the featurizer.
    """

    path: List[str]
    name: str
    klass: object

    def identifier(self):
        """
        Returns a hash that can be used to identify the featurizer selection
        """
        return ".".join(self.path + [self.name])

    def ui_repr(self):
        """Computes a dictionary containing information about the featurizer

        Note that this doesn't include the identifier at this stage

        Returns:
            A dictionary describing the featurizer.
        """
        return {"path": self.path, "name": self.name}

    def help_html(self):
        # Based on the pydoc implementation here:
        # https://github.com/python/cpython/blob/3.10/Lib/pydoc.py
        from pydoc import HTMLDoc, getdoc

        d = HTMLDoc()
        return d.markup(getdoc(self.klass), d.preformat)


@lru_cache
def featurizer_map():
    """Computes a mapping from featurizer identifiers to UI information blocks

    Returns:
        a map of featurizer UI information blocks, indexed by featurizer id.
    """
    return {
        f.identifier(): f
        for f in [
            FeaturizerIdentity(
                ["bandstructure"],
                "BranchPointEnergy",
                matminer.featurizers.bandstructure.BranchPointEnergy,
            ),
            FeaturizerIdentity(
                ["bandstructure"],
                "BandFeaturizer",
                matminer.featurizers.bandstructure.BandFeaturizer,
            ),
            FeaturizerIdentity(
                ["composition", "alloy"],
                "Miedema",
                matminer.featurizers.composition.alloy.Miedema,
            ),
            FeaturizerIdentity(
                ["composition", "alloy"],
                "YangSolidSolution",
                matminer.featurizers.composition.alloy.YangSolidSolution,
            ),
            FeaturizerIdentity(
                ["composition", "alloy"],
                "WenAlloys",
                matminer.featurizers.composition.alloy.WenAlloys,
            ),
            # Disabled for now as it requires additional inputs
            # FeaturizerIdentity(
            #     ["composition", "composite"],
            #     "ElementProperty",
            #     matminer.featurizers.composition.composite.ElementProperty,
            # ),
            FeaturizerIdentity(
                ["composition", "composite"],
                "Meredig",
                matminer.featurizers.composition.composite.Meredig,
            ),
            FeaturizerIdentity(
                ["composition", "element"],
                "ElementFraction",
                matminer.featurizers.composition.element.ElementFraction,
            ),
            FeaturizerIdentity(
                ["composition", "element"],
                "TMetalFraction",
                matminer.featurizers.composition.element.TMetalFraction,
            ),
            FeaturizerIdentity(
                ["composition", "element"],
                "Stoichiometry",
                matminer.featurizers.composition.element.Stoichiometry,
            ),
            FeaturizerIdentity(
                ["composition", "element"],
                "BandCenter",
                matminer.featurizers.composition.element.BandCenter,
            ),
            FeaturizerIdentity(
                ["composition", "ion"],
                "OxidationStates",
                matminer.featurizers.composition.ion.OxidationStates,
            ),
            FeaturizerIdentity(
                ["composition", "ion"],
                "IonProperty",
                matminer.featurizers.composition.ion.IonProperty,
            ),
            FeaturizerIdentity(
                ["composition", "ion"],
                "ElectronAffinity",
                matminer.featurizers.composition.ion.ElectronAffinity,
            ),
            FeaturizerIdentity(
                ["composition", "ion"],
                "ElectronegativityDiff",
                matminer.featurizers.composition.ion.ElectronegativityDiff,
            ),
            FeaturizerIdentity(
                ["composition", "orbital"],
                "AtomicOrbitals",
                matminer.featurizers.composition.orbital.AtomicOrbitals,
            ),
            FeaturizerIdentity(
                ["composition", "orbital"],
                "ValenceOrbital",
                matminer.featurizers.composition.orbital.ValenceOrbital,
            ),
            FeaturizerIdentity(
                ["composition", "packing"],
                "AtomicPackingEfficiency",
                matminer.featurizers.composition.packing.AtomicPackingEfficiency,
            ),
            # These ones are disabled for now: Constructing this kind of featurizer
            # is not possible without providing an API key for the Materials
            # Project API.
            # See https://materialsproject.org/api for more details
            # FeaturizerIdentity(
            #     ["composition", "thermo"],
            #     "CohesiveEnergy",
            #     matminer.featurizers.composition.thermo.CohesiveEnergy,
            # ),
            # FeaturizerIdentity(
            #     ["composition", "thermo"],
            #     "CohesiveEnergyMP",
            #     matminer.featurizers.composition.thermo.CohesiveEnergyMP,
            # ),
            FeaturizerIdentity(
                ["conversions"],
                "ASEAtomstoStructure",
                matminer.featurizers.conversions.ASEAtomstoStructure,
            ),
            FeaturizerIdentity(
                ["conversions"],
                "CompositionToOxidComposition",
                matminer.featurizers.conversions.CompositionToOxidComposition,
            ),
            # This one is disabled for now: Constructing this kind of featurizer
            # is not possible without providing an API key for the Materials
            # Project API.
            # See https://materialsproject.org/api for more details
            # FeaturizerIdentity(
            #     ["conversions"],
            #     "CompositionToStructureFromMP",
            #     matminer.featurizers.conversions.CompositionToStructureFromMP,
            # ),
            FeaturizerIdentity(
                ["conversions"],
                "DictToObject",
                matminer.featurizers.conversions.DictToObject,
            ),
            FeaturizerIdentity(
                ["conversions"],
                "JsonToObject",
                matminer.featurizers.conversions.JsonToObject,
            ),
            # Disabled for now as it requires additional inputs
            # FeaturizerIdentity(
            #     ["conversions"],
            #     "PymatgenFunctionApplicator",
            #     matminer.featurizers.conversions.PymatgenFunctionApplicator,
            # ),
            FeaturizerIdentity(
                ["conversions"],
                "StrToComposition",
                matminer.featurizers.conversions.StrToComposition,
            ),
            FeaturizerIdentity(
                ["conversions"],
                "StructureToComposition",
                matminer.featurizers.conversions.StructureToComposition,
            ),
            FeaturizerIdentity(
                ["conversions"],
                "StructureToIStructure",
                matminer.featurizers.conversions.StructureToIStructure,
            ),
            FeaturizerIdentity(
                ["conversions"],
                "StructureToOxidStructure",
                matminer.featurizers.conversions.StructureToOxidStructure,
            ),
            FeaturizerIdentity(
                ["dos"], "DopingFermi", matminer.featurizers.dos.DopingFermi
            ),
            FeaturizerIdentity(
                ["dos"], "DosAsymmetry", matminer.featurizers.dos.DosAsymmetry
            ),
            FeaturizerIdentity(
                ["dos"], "Hybridization", matminer.featurizers.dos.Hybridization
            ),
            FeaturizerIdentity(["dos"], "SiteDOS", matminer.featurizers.dos.SiteDOS),
            FeaturizerIdentity(
                ["function"],
                "FunctionFeaturizer",
                matminer.featurizers.function.FunctionFeaturizer,
            ),
            # Disabled for now as it requires additional inputs
            # FeaturizerIdentity(
            #     ["site", "bonding"],
            #     "AverageBondAngle",
            #     matminer.featurizers.site.bonding.AverageBondAngle,
            # ),
            # FeaturizerIdentity(
            #     ["site", "bonding"],
            #     "AverageBondLength",
            #     matminer.featurizers.site.bonding.AverageBondLength,
            # ),
            FeaturizerIdentity(
                ["site", "bonding"],
                "BondOrientationalParameter",
                matminer.featurizers.site.bonding.BondOrientationalParameter,
            ),
            # Disabled for now as it requires additional inputs
            # FeaturizerIdentity(
            #     ["site", "chemical"],
            #     "ChemicalSRO",
            #     matminer.featurizers.site.chemical.ChemicalSRO,
            # ),
            FeaturizerIdentity(
                ["site", "chemical"],
                "EwaldSiteEnergy",
                matminer.featurizers.site.chemical.EwaldSiteEnergy,
            ),
            FeaturizerIdentity(
                ["site", "chemical"],
                "LocalPropertyDifference",
                matminer.featurizers.site.chemical.LocalPropertyDifference,
            ),
            FeaturizerIdentity(
                ["site", "chemical"],
                "SiteElementalProperty",
                matminer.featurizers.site.chemical.SiteElementalProperty,
            ),
            # Disabled for now as it requires additional inputs
            # FeaturizerIdentity(
            #     ["site", "external"], "SOAP", matminer.featurizers.site.external.SOAP
            # ),
            FeaturizerIdentity(
                ["site", "fingerprint"],
                "AGNIFingerprints",
                matminer.featurizers.site.fingerprint.AGNIFingerprints,
            ),
            # Disabled for now as it requires additional inputs
            # FeaturizerIdentity(
            #     ["site", "fingerprint"],
            #     "ChemEnvSiteFingerprint",
            #     matminer.featurizers.site.fingerprint.ChemEnvSiteFingerprint,
            # ),
            # FeaturizerIdentity(
            #     ["site", "fingerprint"],
            #     "CrystalNNFingerprint",
            #     matminer.featurizers.site.fingerprint.CrystalNNFingerprint,
            # ),
            FeaturizerIdentity(
                ["site", "fingerprint"],
                "OPSiteFingerprint",
                matminer.featurizers.site.fingerprint.OPSiteFingerprint,
            ),
            FeaturizerIdentity(
                ["site", "fingerprint"],
                "VoronoiFingerprint",
                matminer.featurizers.site.fingerprint.VoronoiFingerprint,
            ),
            FeaturizerIdentity(
                ["site", "misc"],
                "CoordinationNumber",
                matminer.featurizers.site.misc.CoordinationNumber,
            ),
            FeaturizerIdentity(
                ["site", "misc"],
                "IntersticeDistribution",
                matminer.featurizers.site.misc.IntersticeDistribution,
            ),
            # Disabled for now as it requires additional inputs
            # FeaturizerIdentity(
            #     ["site", "rdf"],
            #     "AngularFourierSeries",
            #     matminer.featurizers.site.rdf.AngularFourierSeries,
            # ),
            FeaturizerIdentity(
                ["site", "rdf"],
                "GaussianSymmFunc",
                matminer.featurizers.site.rdf.GaussianSymmFunc,
            ),
            # Disabled for now as it requires additional inputs
            # FeaturizerIdentity(
            #     ["site", "rdf"],
            #     "GeneralizedRadialDistributionFunction",
            #     matminer.featurizers.site.rdf.GeneralizedRadialDistributionFunction,
            # ),
            FeaturizerIdentity(
                ["structure", "bonding"],
                "BagofBonds",
                matminer.featurizers.structure.bonding.BagofBonds,
            ),
            FeaturizerIdentity(
                ["structure", "bonding"],
                "BondFractions",
                matminer.featurizers.structure.bonding.BondFractions,
            ),
            FeaturizerIdentity(
                ["structure", "bonding"],
                "GlobalInstabilityIndex",
                matminer.featurizers.structure.bonding.GlobalInstabilityIndex,
            ),
            FeaturizerIdentity(
                ["structure", "bonding"],
                "MinimumRelativeDistances",
                matminer.featurizers.structure.bonding.MinimumRelativeDistances,
            ),
            FeaturizerIdentity(
                ["structure", "bonding"],
                "StructuralHeterogeneity",
                matminer.featurizers.structure.bonding.StructuralHeterogeneity,
            ),
            FeaturizerIdentity(
                ["structure", "composite"],
                "JarvisCFID",
                matminer.featurizers.structure.composite.JarvisCFID,
            ),
            FeaturizerIdentity(
                ["structure", "matrix"],
                "CoulombMatrix",
                matminer.featurizers.structure.matrix.CoulombMatrix,
            ),
            FeaturizerIdentity(
                ["structure", "matrix"],
                "OrbitalFieldMatrix",
                matminer.featurizers.structure.matrix.OrbitalFieldMatrix,
            ),
            FeaturizerIdentity(
                ["structure", "matrix"],
                "SineCoulombMatrix",
                matminer.featurizers.structure.matrix.SineCoulombMatrix,
            ),
            FeaturizerIdentity(
                ["structure", "misc"],
                "EwaldEnergy",
                matminer.featurizers.structure.misc.EwaldEnergy,
            ),
            FeaturizerIdentity(
                ["structure", "misc"],
                "StructureComposition",
                matminer.featurizers.structure.misc.StructureComposition,
            ),
            FeaturizerIdentity(
                ["structure", "misc"],
                "XRDPowderPattern",
                matminer.featurizers.structure.misc.XRDPowderPattern,
            ),
            FeaturizerIdentity(
                ["structure", "order"],
                "ChemicalOrdering",
                matminer.featurizers.structure.order.ChemicalOrdering,
            ),
            FeaturizerIdentity(
                ["structure", "order"],
                "DensityFeatures",
                matminer.featurizers.structure.order.DensityFeatures,
            ),
            FeaturizerIdentity(
                ["structure", "order"],
                "MaximumPackingEfficiency",
                matminer.featurizers.structure.order.MaximumPackingEfficiency,
            ),
            FeaturizerIdentity(
                ["structure", "order"],
                "StructuralComplexity",
                matminer.featurizers.structure.order.StructuralComplexity,
            ),
            FeaturizerIdentity(
                ["structure", "rdf"],
                "ElectronicRadialDistributionFunction",
                matminer.featurizers.structure.rdf.ElectronicRadialDistributionFunction,
            ),
            FeaturizerIdentity(
                ["structure", "rdf"],
                "PartialRadialDistributionFunction",
                matminer.featurizers.structure.rdf.PartialRadialDistributionFunction,
            ),
            FeaturizerIdentity(
                ["structure", "rdf"],
                "RadialDistributionFunction",
                matminer.featurizers.structure.rdf.RadialDistributionFunction,
            ),
            # Disabled for now as it requires additional inputs
            # FeaturizerIdentity(
            #     ["structure", "sites"],
            #     "SiteStatsFingerprint",
            #     matminer.featurizers.structure.sites.SiteStatsFingerprint,
            # ),
            FeaturizerIdentity(
                ["structure", "symmetry"],
                "Dimensionality",
                matminer.featurizers.structure.symmetry.Dimensionality,
            ),
            FeaturizerIdentity(
                ["structure", "symmetry"],
                "GlobalSymmetryFeatures",
                matminer.featurizers.structure.symmetry.GlobalSymmetryFeatures,
            ),
        ]
    }


def create_featurizer(id):
    """
    Args:
        id (str): unique identifier of the featurizer

    Returns:
        object: featurizer object
    """
    featurizer_class = featurizer_map()[id].klass
    featurizer = featurizer_class()

    featurizer.set_n_jobs(1)
    return featurizer
