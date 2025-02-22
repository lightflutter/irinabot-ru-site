import React, { useContext, useEffect, useState } from "react";
import { Button, Form, Grid, Icon } from "semantic-ui-react";
import {
  AppRuntimeSettingsContext,
  AuthContext,
  CacheContext,
} from "../../context";
import { useCategoryFilter } from "../../hooks/useCategoryFilter";
import { Flags } from "../../models/rest/Flags";

import "./FlagsEditBlock.scss";

interface FlagsEditBlockProps {
  flags?: Flags;
  onFlagsChange?: (flags?: Flags) => void;
  loading?: boolean;
}

function FlagsEditBlock({
  flags,
  loading,
  onFlagsChange,
}: FlagsEditBlockProps) {
  const cacheContext = useContext(CacheContext);

  const { apiToken } = useContext(AuthContext).auth;

  const { language } = useContext(AppRuntimeSettingsContext);
  const t = language.getString;

  const [selectedCategories, setSelectedCategories] = useState<number[]>([]);
  const [canDownload, setCanDownload] = useState<boolean | undefined>(true);
  const [imagesAvailable, setImagesAvailable] = useState<boolean | undefined>(
    true
  );
  const [mapLocked, setMapLocked] = useState<boolean | undefined>(false);
  const [mapVerified, setMapVerified] = useState<boolean | undefined>(false);
  const [shortTag, setShortTag] = useState<string>("");

  const dropdownOptions = useCategoryFilter(
    selectedCategories,
    cacheContext.cachedCategories,
    5
  );

  useEffect(() => {
    if (cacheContext.cachedCategories.length === 0)
      cacheContext.cacheCategories();
  }, [cacheContext.cachedCategories, cacheContext.cacheCategories]);

  useEffect(() => {
    if (flags) {
      setSelectedCategories(flags.categories || []);
      setCanDownload(flags.canDownload);
      setImagesAvailable(flags.imagesAvailable);
      setMapLocked(flags.mapLocked);
      setMapVerified(flags.mapVerified);
      setShortTag(flags.shortTag || "");
    }
  }, [flags]);

  const updateFlags = () => {
    if (onFlagsChange) {
      onFlagsChange({
        categories: selectedCategories,
        canDownload,
        imagesAvailable,
        mapLocked,
        shortTag: mapVerified ? shortTag : undefined,
        mapVerified,
      });
    }
  };

  return (
    <div className="flags-edit">
      <Grid columns="equal" stackable>
        {apiToken.hasAuthority("MAP_FLAGS_READ_TIER_2") && (
          <Grid.Column>
            <Form>
              <Form.Checkbox
                checked={canDownload}
                onChange={(_, data) => {
                  setCanDownload(!!data.checked);
                }}
                label={t("page.map.edit.flagsBlock.canDownload")}
              />
              <Form.Checkbox
                checked={mapLocked}
                onChange={(_, data) => {
                  setMapLocked(!!data.checked);
                }}
                label={t("page.map.edit.flagsBlock.lock")}
              />
            </Form>
          </Grid.Column>
        )}

        <Grid.Column>
          <Form>
            {apiToken.hasAuthority("MAP_FLAGS_READ_TIER_1") && (
              <Form.Checkbox
                checked={imagesAvailable}
                onChange={(_, data) => {
                  setImagesAvailable(!!data.checked);
                }}
                label={t("page.map.edit.flagsBlock.imagesAvailable")}
              />
            )}
            <Form.Checkbox
              checked={mapVerified}
              onChange={(_, data) => {
                setMapVerified(!!data.checked);
              }}
              disabled={!apiToken.hasAuthority("MAP_VERIFY")}
              label={t("page.map.edit.flagsBlock.isVerified")}
            />
          </Form>
        </Grid.Column>
      </Grid>
      <div className="block">
        <Form>
          <Form.Group widths="equal">
            <Form.Dropdown
              label={t("page.map.edit.flagsBlock.category")}
              fluid
              multiple
              placeholder={t("page.map.edit.flagsBlock.phcategory")}
              selection
              options={dropdownOptions}
              loading={cacheContext.cachedCategories.length === 0}
              onChange={(e, p) => {
                setSelectedCategories(p.value as number[]);
              }}
              value={selectedCategories}
            />
            <Form.Input
              value={shortTag}
              onChange={(_, data) => {
                setShortTag(data.value);
              }}
              disabled={!apiToken.hasAuthority("MAP_VERIFY") || !mapVerified}
              fluid
              label={t("page.map.edit.flagsBlock.tag")}
            />
          </Form.Group>
        </Form>
      </div>
      {onFlagsChange && (
        <Button loading={loading} onClick={updateFlags} color="green">
          <Icon name="save" />
          {t("page.map.edit.flagsBlock.tosave")}
        </Button>
      )}
    </div>
  );
}

export default FlagsEditBlock;
